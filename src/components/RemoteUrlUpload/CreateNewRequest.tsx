import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import { ChooseFilesToUpload } from './CreateNewRequest/ChooseFilesToUpload';
import { FinalStep } from './CreateNewRequest/FinalStep';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient';
import { TextField, Paper, Typography, Stepper, Step, StepLabel, StepContent, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin, googleLogout, useGoogleOneTapLogin } from '@react-oauth/google';
import { googleScopes } from './../../lib/config';
import prettyBytes from 'pretty-bytes';
import { useToken } from '../../lib/useToken';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: 0
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        // padding: theme.spacing(3),
    },
}));

export const CreateNewRequest = () => {
    const classes = useStyles();
    let query = useQuery();

    const [fileName, setFileName] = useState(query.get('fileName') || '');
    const [parentUrl, setParentUrl] = useState(query.get('parent') || '');

    const [mediaType, setMediaType] = useState('movie');
    const [title, setTitle] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [fileHeaders, setFileHeaders] = useState({});

    const mediaId = query.get('mediaId');
    const [activeStep, setActiveStep] = useState(0);
    const [fileUrl, setFileUrl] = useState(query.get('link') || '');
    const [selectedFiles, setSelectedFiles] = useState([] as { fileName: string, fileUrl: string, fileSize: number }[]);
    const [rawUpload, setRawUpload] = useState(true);
    const [validationResult, setValidationResult] = useState<{ size: number | null, fileName: string | null, acceptsRanges: boolean, status: number } | null>(null);
    const [validating, setValidating] = useState(false);
    const fileNameExtension = fileName && fileName.split('.').pop();

    useEffect(() => {
        if (mediaId) {
            (async () => {
                const mediaDetails = await apiClient.get(`items/${mediaId}`);
                const { itemType, title, year } = mediaDetails.data;
                setMediaType(itemType);
                setYear(year);
                setTitle(title);
            })();
        }
    }, [mediaId]);

    useEffect(() => {
        if (parentUrl) {
            (async () => {
                const utocall = `https://nurlresolver.netlify.app/.netlify/functions/server/resolve?m=true&q=${encodeURIComponent(parentUrl)}`;
                const response = await axios.get(utocall);
                if (response.data.length === 1) {
                    const { headers, title, link } = response.data[0];
                    setFileName(title);
                    setFileUrl(link);
                    setFileHeaders(headers);
                } else {
                    alert('invalid response received!')
                }
            })();
        }
    }, [parentUrl]);

    const { access_token, isValid, setToken } = useToken();
    const login = useGoogleLogin({
        onSuccess: setToken,
        flow: 'implicit',
        scope: googleScopes
    });

    const steps = ['Enter the file URL (any types including zip)', 'Choose Files to Upload', 'Finish'];

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <TextField name="fileUrl" type="URL" defaultValue={fileUrl} fullWidth onChange={e => setFileUrl(e.target.value)} />
                        {rawUpload && <Button variant="outlined" disabled={validating} onClick={async () => {
                            setValidating(true);
                            try {
                                const response = await apiClient.post('validate-url', { fileUrl, fileUrlHeaders: fileHeaders });
                                const { fileName: validatedFileName } = response.data;
                                const fallbackName = fileUrl.split('/').pop() || '';
                                if (validatedFileName) setFileName(validatedFileName);
                                setTitle(validatedFileName || fallbackName);
                                setValidationResult(response.data);
                            } catch (e: any) {
                                setValidationResult({ size: null, fileName: null, acceptsRanges: false, status: e?.response?.status || 0 });
                            }
                            setValidating(false);
                        }}>{validating ? 'Validating...' : 'Validate'}</Button>}
                    </div>
                    {validationResult && (
                        <div style={{ fontSize: '0.85em', marginTop: 4, color: validationResult.status >= 400 ? 'red' : 'inherit' }}>
                            {validationResult.status >= 400
                                ? `Validation failed (status ${validationResult.status})`
                                : `Size: ${validationResult.size != null ? prettyBytes(validationResult.size) : 'unknown'} | ${validationResult.acceptsRanges ? 'Range-supported' : 'No range'} | File: ${validationResult.fileName || 'unknown'}`}
                        </div>
                    )}
                    <TextField name="parentUrl" label="Parent URL" defaultValue={parentUrl} fullWidth onChange={e => setParentUrl(e.target.value)} />
                    <TextField name="title" label="Title" value={title} fullWidth onChange={e => setTitle(e.target.value)} />
                    <div style={{ display: 'flex', gap: 16 }}>
                        <FormControl fullWidth>
                            <InputLabel>Media Type</InputLabel>
                            <Select name="mediaType" value={mediaType} onChange={e => setMediaType(e.target.value as string)}>
                                <MenuItem value="movie">Movie</MenuItem>
                                <MenuItem value="tv">TV</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Year</InputLabel>
                            <Select name="year" value={year} onChange={e => setYear(e.target.value as string)}>
                                {Array.from({ length: new Date().getFullYear() + 5 - 1900 + 1 }, (_, i) => 1900 + i).map(y => (
                                    <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <p>{JSON.stringify(fileHeaders)}</p>
                    <FormControlLabel control={<Checkbox name="rawUpload"
                        checked={rawUpload}
                        onChange={ev => setRawUpload(ev.target.checked)}
                        disabled={fileNameExtension !== 'zip'} />} label="Raw Upload" />
                    {isValid ? <Button onClick={() => googleLogout()}>Logout</Button> : <Button onClick={() => login()}>Login</Button>}
                    {/* <Goo /> */}
                </div>;
            case 1:
                return <ChooseFilesToUpload defaultZipFileUrl={fileUrl} onSelectionChange={setSelectedFiles} />;
            case 2:
                return <FinalStep selectedFiles={selectedFiles} parentUrl={parentUrl}
                    mediaType={mediaType}
                    title={title}
                    year={year}
                    fileHeaders={fileHeaders}
                    accessToken={access_token}
                />;
            default:
                return 'unknown step'
        }
    }

    const handleNext = async () => {
        if (activeStep === 0 && rawUpload) {
            const response = await apiClient.post('validate-url', { fileUrl, fileUrlHeaders: fileHeaders });
            const { size, fileName: validatedFileName } = response.data;
            setSelectedFiles([{ fileUrl, fileName: validatedFileName || fileName, fileSize: size || 0 }]);
            setActiveStep(2);
        }
        else
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        if (activeStep === 2 && rawUpload)
            setActiveStep(0)
        else
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };


    return (
        <div>
            <Stepper classes={{ root: classes.root }} activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            <Typography>{getStepContent(index)}</Typography>
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} className={classes.button}>
                        Reset
                    </Button>
                </Paper>
            )}
        </div>
    );
}

const Goo = () => {
    useGoogleOneTapLogin({
        onSuccess: (response) => console.log(response),
        onError: () => console.log('Login Failed'),
        auto_select: true,
    })

    return <div>Goo</div>
}