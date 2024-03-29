import {
    Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemIcon, ListItemText
} from "@material-ui/core"
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient'
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import React from "react";

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
    }
}));

type smProps = {
    show: boolean,
    mediaItemId: string,
    query: string,
    handleSelect: any,
    items: {
        renderedTitle: string,
        id: number
    }[]
}

export const SimilarMovieAssign = ({ show, mediaItemId, query, handleSelect, items }: smProps) => {
    const classes = useStyles();


    const [checked, setChecked] = useState<number[]>([]);
    const handleClose = () => {
        handleSelect();
    };

    useEffect(() => {
        const checkedItems = items?.map(x => x.id) || [];
        setChecked(checkedItems)
    }, [items]);

    const handleToggle = (value:number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const assignSelection = async () => {
        for (const mediaSourceId of checked) {
            await apiClient.put(`/mediasources/${mediaSourceId}/mediaItemId/${mediaItemId}`);
        }
        handleSelect(checked);
    }

    return (
        <div>
            <Dialog open={show}
                fullWidth={true}
                classes={{ paper: classes.dialogPaper }}
                onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>
                    Related media items to {query}
                </DialogTitle>
                <DialogContent dividers>
                    {
                        items && (<List>
                            {items.map((value) => {
                                const labelId = `checkbox-list-label-${value.id}`;
                                return (<ListItem
                                    key={value.id}
                                    button
                                    onClick={handleToggle(value.id)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.indexOf(value.id) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={value.renderedTitle} />
                                </ListItem>)
                            })}
                        </List>)
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={assignSelection} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}