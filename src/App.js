import React from "react";
import { Albums } from "./features/albums/Albums";
import { Heading, Pane } from "evergreen-ui";

function App() {
    return (
        <Pane
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
        >
            <Pane
                display="flex"
                background="tint2"
                borderRadius={3}
                width="100%"
                padding={16}
            >
                <Pane flex={1} alignItems="center" display="flex">
                    <Heading size={600}>Beets UI</Heading>
                </Pane>
            </Pane>
            <Pane width="100%" padding={16}>
                <Albums />
            </Pane>
        </Pane>
    );
}

export default App;
