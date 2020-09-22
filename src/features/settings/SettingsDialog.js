import { useDispatch, useSelector } from "react-redux";
import {
    BanCircleIcon,
    Button,
    Checkbox,
    Dialog,
    Pane,
    Paragraph,
    TextInputField,
    TickCircleIcon,
} from "evergreen-ui";
import React, { Fragment } from "react";
import {
    changeBasicAuthEnabled,
    changePassword,
    changeUrl,
    changeUsername,
    isBasicAuthEnabled,
    loadSettings,
    selectNewSettings,
    selectTestStatus,
    selectWipSettings,
    SettingsTestStatus,
    testNewSettings,
} from "./settingsSlice";
import { hideSettingsDialog, saveSettings } from "../global/globalSlice";

export function SettingsDialog({ isShown, canClose }) {
    const wipSettings = useSelector(selectWipSettings);
    const validSettings = useSelector(selectNewSettings);
    const basicAuthEnabled = useSelector(isBasicAuthEnabled);
    const testStatus = useSelector(selectTestStatus);

    const dispatch = useDispatch();

    return (
        <Dialog
            title={"Settings"}
            isShown={isShown}
            hasClose={canClose}
            shouldCloseOnEscapePress={canClose}
            shouldCloseOnOverlayClick={canClose}
            isConfirmDisabled={
                !validSettings ||
                testStatus.status !== SettingsTestStatus.SUCCESS
            }
            onConfirm={() => dispatch(saveSettings(validSettings))}
            onOpenComplete={() => dispatch(loadSettings())}
            onCloseComplete={() => dispatch(hideSettingsDialog())}
        >
            <div>
                <TextInputField
                    label="Beets URL"
                    description="The URL of your Beets API instance. Include the protocol and port"
                    placeholder="http://localhost:8000"
                    value={wipSettings.url}
                    onChange={(event) =>
                        dispatch(changeUrl(event.target.value))
                    }
                />

                <Checkbox
                    checked={wipSettings.basicAuthEnabled}
                    onChange={(e) =>
                        dispatch(changeBasicAuthEnabled(e.target.checked))
                    }
                    label="Enable HTTP basic authentication?"
                />

                {basicAuthEnabled && (
                    <TextInputField
                        label="Username"
                        description="Your basic authentication username"
                        placeholder="admin"
                        value={wipSettings.username}
                        onChange={(event) =>
                            dispatch(changeUsername(event.target.value))
                        }
                    />
                )}

                {basicAuthEnabled && (
                    <TextInputField
                        label="Password"
                        description="Your basic authentication password"
                        placeholder="password123"
                        value={wipSettings.password}
                        onChange={(event) =>
                            dispatch(changePassword(event.target.value))
                        }
                    />
                )}
            </div>

            <Button
                disabled={!validSettings}
                onClick={() => dispatch(testNewSettings())}
                marginBottom={16}
            >
                Test connection
            </Button>

            <TestResult status={testStatus} />
        </Dialog>
    );
}

function TestResult({ status }) {
    switch (status.status) {
        case SettingsTestStatus.SUCCESS:
            return (
                <Pane display={"flex"} alignItems={"center"}>
                    <TickCircleIcon color="success" marginRight={8} />

                    <Paragraph>Connection successful</Paragraph>
                </Pane>
            );
        case SettingsTestStatus.FAILED:
            return (
                <Pane display={"flex"} alignItems={"center"}>
                    <BanCircleIcon color="danger" marginRight={8} />

                    <Paragraph>Connection failed: {status.error}</Paragraph>
                </Pane>
            );
        case SettingsTestStatus.NOT_RUN:
        default:
            return <Paragraph></Paragraph>;
    }
}
