import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Fab, Tooltip, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import ErrorIcon from '@material-ui/icons/Edit';
import Tree from 'react-d3-tree';
import axios from 'axios';
import clone from 'clone';
import { Link, useParams } from 'react-router-dom';
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonError: {
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }, iconButton: {
        padding: 10,
    }, input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
}));

export const MediaSourceExplorerComponent = ({ items, isLoading }) => {
    let { sourceid } = useParams();
    let pms = useParams();
    console.log(pms, sourceid);

    useEffect(() => {
        console.log('calling me..');
        (async () => {
            console.log('calling me anotehr..');
            const mediaSourceResponse = await apiClient.get(`mediasources/${sourceid}`);
            const { webViewLink } = mediaSourceResponse.data;
            console.log(webViewLink)
            setRootUrl(webViewLink);
            setTreeRootUrl();
        })();
    }, []);

    const classes = useStyles();
    const uniqueid = () => { return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase(); }
    const [rootUrl, setRootUrl] = useState('');

    const handleRootUrlOnChange = (event) => {
        const { value } = event.target;
        setRootUrl(value);
    };

    const setTreeRootUrl = () => {
        setData({
            name: rootUrl,
            attributes: {
                url: rootUrl,
                id: uniqueid()
            }
        })
    };

    const firstuniqueid = uniqueid();
    const initialData = {
        name: rootUrl,
        attributes: {
            url: rootUrl,
            id: firstuniqueid
        }
    };


    const [data, setData] = useState(initialData);

    const renderForeignObjectNode = ({
        nodeDatum,
        toggleNode,
        foreignObjectProps
    }) => (
        <foreignObject {...foreignObjectProps} >
            <div className={classes.wrapper}>
                <Tooltip title={<React.Fragment>
                    Name: {nodeDatum.name}
                    <br></br>
                        Url: {nodeDatum.attributes.url}
                </React.Fragment>}>
                    <Fab
                        color="primary"
                        className={nodeDatum.attributes.hasErrors && classes.buttonError}
                        onClick={() => {
                            if (!nodeDatum.attributes.isTraversed) {
                                if (!nodeDatum.attributes.loading) {
                                    nodeDatum.attributes.hasErrors = false;
                                    nodeDatum.attributes.loading = true;
                                    onNodeClickCallback(nodeDatum);
                                }
                            }
                            toggleNode();
                        }}
                    >
                        {nodeDatum.attributes.hasErrors && <ErrorIcon />}
                    </Fab>
                </Tooltip>
                {nodeDatum.attributes.loading && <CircularProgress size={68} className={classes.fabProgress} />}
            </div>
        </foreignObject>
    );

    const onNodeClickCallback = async (ctx) => {
        if (ctx.attributes.isTraversed) return;
        const nextData = clone(data);
        const leafnode = findNodeFromName(nextData, ctx.attributes.id);
        try {
            leafnode.attributes.hasErrors = false;
            const utocall = `https://nurlresolver.netlify.app/.netlify/functions/server/resolve?q=${encodeURIComponent(ctx.attributes.url)}`;
            const response = await axios.get(utocall);
            const children = [];
            for (const resolvedUrl of response.data) {
                const anotherdata = {
                    name: resolvedUrl.title, attributes: {
                        url: resolvedUrl.link,
                        id: uniqueid()
                    }
                }
                children.push(anotherdata);
            }
            leafnode.attributes.isTraversed = true;
            leafnode.children = children;
        } catch (error) {
            leafnode.attributes.hasErrors = true;
            leafnode.attributes.isLoading = false;
        }
        setData(nextData);
    };

    function findNodeFromName(parentNode, keyName) {
        if (parentNode.attributes.id === keyName) {
            return parentNode;
        } else if (parentNode.children?.length) {
            for (const childelement of parentNode.children) {
                const foundele = findNodeFromName(childelement, keyName);
                if (foundele) return foundele;
            }
        }
        return null;
    }

    const nodeSize = { x: 200, y: 200 };
    const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -34, y: -34 };

    return <div>

        <div id="treeWrapper" style={{ height: '40em' }}>
            {rootUrl}
            <TextField label="Root Url" defaultValue={rootUrl} placeholder="Root Url" fullWidth InputProps={{
                endAdornment: (<InputAdornment>
                    <IconButton color="primary" className={classes.iconButton} aria-label="search" onClick={setTreeRootUrl}>
                        <SearchIcon />
                    </IconButton>
                </InputAdornment>)
            }}
                onChange={handleRootUrlOnChange} />
            <Tree data={data}
                orientation='vertical'
                onNodeClick={onNodeClickCallback}
                nodeSize={nodeSize}
                translate={{ x: 100, y: 100 }}
                renderCustomNodeElement={(rd3tProps) =>
                    renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
                }
            />
        </div>
    </div>
}