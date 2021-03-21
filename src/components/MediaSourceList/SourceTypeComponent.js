import { Chip } from '@material-ui/core';
export default function SourceTypeComponent({ value }) {
    const getRenderValue = () => {
        switch (value) {
            case 'hdhub':
                return 'HH'                
            case 'extramovies':
                return 'EM'                
            default:
                return value                
        }
    }
    return <Chip color="primary" label={getRenderValue()} variant="outlined"></Chip>;
}