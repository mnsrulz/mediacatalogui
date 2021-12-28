import { Typography } from '@material-ui/core';
export default function SourceTypeComponent({ value }) {
    const getRenderValue = () => {
        switch (value) {
            case 'hdhub':
                return 'HH'                
            case 'extramovies':
                return 'EM'                
            case 'movipk':
                return 'MPK'                
            default:
                return value                
        }
    }    
    return <Typography variant="body2" color="textSecondary">{getRenderValue()}</Typography>
}
