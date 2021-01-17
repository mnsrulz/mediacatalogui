import { React, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import ChooseFilesToUpload from './CreateNewRequest/ChooseFilesToUpload';
import ChooseFilesToUploadFinalStep from './CreateNewRequest/FinalStep';

import { FormHelperText, TextField, InputLabel, Input, FormControl, Paper, Grid, Typography, Stepper, Step, StepLabel, StepContent } from '@material-ui/core';

// import FormInput from "./../Controls/index";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

function getSteps() {
    return ['Enter a zip file URL', 'Choose Files to Upload', 'Finish'];
}


export default function App() {
    const { control, register, handleSubmit, errors } = useForm();
    const onSubmit = data => { alert('hello'); console.log(data); }

    const classes = useStyles();

    const [activeStep, setActiveStep] = useState(0);
    const [zipFileUrl, setZipFileUrl] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleChange = (e) => {
        setZipFileUrl(e.target.value);
    };

    const handleFileSelection = (e) => {
        setSelectedFiles(e);
    };

    const steps = getSteps();

    function getStepContent(step) {        
        switch (step) {
            case 0:
                return <TextField name="fileUrl" type="URL" defaultValue={zipFileUrl} fullWidth onChange={handleChange} />;
            case 1:
                return <ChooseFilesToUpload defaultZipFileUrl={zipFileUrl} onSelectionChange={handleFileSelection} />;
            case 2:
                return <ChooseFilesToUploadFinalStep selectedFiles={selectedFiles} zipFileUrl = {zipFileUrl} />;
            default:
                return 'unknown step'
        }
    }

    const handleNext = () => {        
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };


    return (
        <div>
            <div className={classes.root}>
                <Stepper activeStep={activeStep} orientation="vertical">
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
            {/* <form onSubmit={handleSubmit(onSubmit)}>
                <Paper style={{ padding: 16 }}>
                    <Typography  >
                        New Request Form
                        </Typography>
                    <Grid container alignItems="flex-start" spacing={2}>
                        <Grid item xs={12}>
                            <TextField name="zipFileUrl" error={!!errors.username} label="Zip File URL"
                                helperText={errors.username ? errors.username.message : ''} type="URL" inputRef={register} fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="username" error={!!errors.username} label="Username"
                                helperText={errors.username ? errors.username.message : ''} type="email" inputRef={register} fullWidth />
                        </Grid>
                        <Grid container item xs={12} justify="flex-end">
                            <Button color="primary" type="submit" variant="contained" fullWidth>Submit</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </form> */}
        </div>
    );
}