import React from "react";
import { Button, Heading, Pane } from "evergreen-ui";
import { Query } from "./features/query/Query";
import { Stats } from "./features/stats/Stats";
import { SettingsDialog } from "./features/settings/SettingsDialog";
import { useDispatch, useSelector } from "react-redux";
import {
    areSettingsPresent,
    shouldShowSettings,
    showSettingsDialog,
} from "./features/global/globalSlice";

function App() {
    const showSettings = useSelector(shouldShowSettings);
    const settingsPresent = useSelector(areSettingsPresent);
    const dispatch = useDispatch();

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
                <Pane>
                    <Stats />
                    <Button onClick={() => dispatch(showSettingsDialog())}>
                        Settings
                    </Button>
                </Pane>
            </Pane>

            <Pane width="100%" padding={16}>
                <Query />
            </Pane>

            <SettingsDialog isShown={showSettings} canClose={settingsPresent} />
        </Pane>
    );
}

export default App;
