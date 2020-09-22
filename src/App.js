import React from "react";
import { Heading, Pane } from "evergreen-ui";
import { Query } from "./features/query/Query";
import { Stats } from "./features/stats/Stats";

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
                justifyContent={"space-between"}
            >
                <Pane flex={1} alignItems="center" display="flex">
                    <Heading size={600}>Beets UI</Heading>
                </Pane>
                <Stats />
            </Pane>

            <Pane width="100%" padding={16}>
                <Query />
            </Pane>
        </Pane>
    );
}

export default App;
