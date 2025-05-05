import React, { useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const CustomIconTooltip = ({children,msg }) => {
  
    const tooltip = (
        <Tooltip id="tooltip-disabled">
            {msg}
        </Tooltip>
    );

    return (
        <OverlayTrigger overlay={tooltip} >
            {children}
        </OverlayTrigger>
    );
};

export default CustomIconTooltip;

