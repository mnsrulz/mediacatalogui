import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import { ChooseFilesToUpload } from './CreateNewRequest/ChooseFilesToUpload';
import { FinalStep } from './CreateNewRequest/FinalStep';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient';
import { TextField, Paper, Typography, Stepper, Step, StepLabel, StepContent, Checkbox, FormControlLabel } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

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

    const [mediaType, setMediaType] = useState('');
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [fileHeaders, setFileHeaders] = useState({});

    const mediaId = query.get('mediaId');
    const [activeStep, setActiveStep] = useState(0);
    const [fileUrl, setFileUrl] = useState(query.get('link') || '');
    const [selectedFiles, setSelectedFiles] = useState([] as {path: string}[]);
    const [rawUpload, setRawUpload] = useState(true);
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

    const steps = ['Enter the file URL (any types including zip)', 'Choose Files to Upload', 'Finish'];

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <div>
                    <TextField name="fileUrl" type="URL" defaultValue={fileUrl} fullWidth onChange={e => setFileUrl(e.target.value)} />
                    <p>Parent: {parentUrl}</p>
                    <p>Media Type: {mediaType}</p>
                    <p>Title: {title}</p>
                    <p>Year: {year}</p>
                    <p>{JSON.stringify(fileHeaders)}</p>
                    <FormControlLabel control={<Checkbox name="rawUpload"
                        checked={rawUpload}
                        onChange={ev => setRawUpload(ev.target.checked)}
                        disabled={fileNameExtension !== 'zip'} />} label="Raw Upload" />
                </div>;
            case 1:
                return <ChooseFilesToUpload defaultZipFileUrl={fileUrl} onSelectionChange={setSelectedFiles} />;
            case 2:
                return <FinalStep selectedFiles={selectedFiles} fileUrl={fileUrl} parentUrl={parentUrl}
                    mediaType={mediaType}
                    title={title}
                    year={year}
                    rawUpload={rawUpload}
                    fileHeaders={fileHeaders}
                />;
            default:
                return 'unknown step'
        }
    }

    const handleNext = () => {
        if (activeStep === 0 && rawUpload) {
            //put validation
            setSelectedFiles([{ path: fileName }]);
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