import React, { useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const CustomTooltip = ({ maxLength, content, tooltipWidth = '500px' }) => {
    const shouldDisplayFullContent = useMemo(() => {
        return content?.length <= maxLength;
    }, [content, maxLength]);

    const truncateString = (str) => {
        if (str?.length > maxLength) {
            return str.slice(0, maxLength - 3) + '...';
        }
        return str;
    };

    const displayContent = useMemo(() => {
        return shouldDisplayFullContent ? content : truncateString(content);
    }, [content, maxLength, shouldDisplayFullContent]);

    const tooltip = (
        <Tooltip id="tooltip-disabled">
            {content}
        </Tooltip>
    );

    return (
        <OverlayTrigger overlay={!shouldDisplayFullContent ? tooltip : <span></span>} >
            <span className={`${!shouldDisplayFullContent ? 'cursor-pointer' : ''}`}>{displayContent ? displayContent :'-'}</span>
        </OverlayTrigger>
    );
};

export default CustomTooltip;
