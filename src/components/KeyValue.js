import { Paragraph } from "evergreen-ui";
import React from "react";

export default function KeyVal({ label, value }) {
    return (
        <Paragraph>
            <span style={{ "font-weight": "bold", "padding-right": "1em" }}>
                {label}
            </span>

            {value || "Unknown"}
        </Paragraph>
    );
}
