import React, { useEffect, useState } from 'react';
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";
import axios from 'axios';
import { CollapsableListView } from './CollapsableListView';
const prettyBytes = require('pretty-bytes');

export const SourceExplorer = ({ mediaId, rootTitle }) => {
    const [sources, setSources] = useState([]);
    const _ctx = {
        mediaId,
        rootTitle
    }

    const [data, setData] = useState({});

    const onToggle = async (node, toggled) => {
        node.active = true;
        if (!node.loading && !node.loaded) {
            node.loading = true;
            node.toggled = toggled;
            setData(Object.assign({}, data));
            const utocall = `https://nurlresolver.netlify.app/.netlify/functions/server/resolve?m=true&q=${encodeURIComponent(node.link)}`;
            const response = await axios.get(utocall);
            node.loading = false;
            node.loaded = true;

            for (const resolvedUrl of response.data) {
                const { isPlayable, contentType, size } = resolvedUrl;
                const fileName = resolvedUrl.link && decodeURIComponent((new URL(resolvedUrl.link)).pathname.split('/').pop());

                const anotherdata = {
                    name: resolvedUrl.title || fileName,
                    link: resolvedUrl.link,
                    children: [],
                    canExpand: !isPlayable,
                    loaded: false,
                    parent: resolvedUrl.parent,
                    fileName: resolvedUrl.title || fileName,
                    _ctx
                }
                if (isPlayable) {
                    anotherdata.name = `${anotherdata.name} (${prettyBytes(parseInt(size) || 0)}) (${contentType})`;
                }

                node.children.push(anotherdata);
            }
        } else if (node.children) {
            node.toggled = toggled;
        }
        setData(Object.assign({}, data));
    }

    useEffect(() => {
        (async () => {
            const mediaSources = await apiClient.get(`items/${mediaId}/mediasources`);

            const d2 = {
                name: rootTitle,
                toggled: true,
                children: [],
                canExpand: true,
                loaded: true,
                _ctx
            }

            for (const itemData of mediaSources.data) {
                const { webViewLink, renderedTitle } = itemData;
                d2.children.push({
                    name: renderedTitle,
                    link: webViewLink,
                    children: [],
                    canExpand: true,
                    loaded: false,
                    _ctx
                });
            }
            setData(d2);
        })();
    }, [mediaId]);

    return (
        <div>
            <CollapsableListView data={data} handleToggle={onToggle} />
        </div>
    )
}