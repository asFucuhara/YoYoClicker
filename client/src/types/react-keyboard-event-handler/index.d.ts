declare module "react-keyboard-event-handler" {
    import React from "react";
    export const KeyboardEventHandler: React.SFC<{
        handleKeys?: string[];
        onKeyEvent: { (key: string, e: React.KeyboardEvent): void };
    }>;
    export default KeyboardEventHandler;
}