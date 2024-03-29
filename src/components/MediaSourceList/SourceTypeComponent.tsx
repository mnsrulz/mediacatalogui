import { Typography } from '@material-ui/core';
import React from 'react';
type SourceTypeProps = {
    value: string
}
export default function SourceTypeComponent({ value }:SourceTypeProps) {
    const getRenderValue = () => {
        switch (value) {
            case 'hdhub':
                return 'HH'
            case 'extramovies':
                return 'EM'
            case 'movipk':
                return 'MPK'
            case '1337xhd':
                return 'XHD'
            default:
                return value
        }
    }
    return <Typography variant="body2" color="textSecondary">{getRenderValue()}</Typography>
}
