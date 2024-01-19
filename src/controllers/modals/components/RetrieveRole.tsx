import { Text } from "preact-i18n";

import { Modal } from "@revoltchat/ui";

import { noopTrue } from "../../../lib/js";

import { ModalProps } from "../types";
import { Steps } from "antd";

/**
 * Report success modal
 */
export default function RetrieveRole({
    server,
    ...props
}: ModalProps<"report_success">) {
    return (
        <Modal
            {...props}
            title={<Text id="app.special.modals.report.reported" />}
            // actions={...} // your actions code
        >
            <Steps
                current={1}
                items={[
                    {
                        title: 'Finished',
                    },
                    {
                        title: 'In Progress',
                        subTitle: 'Left 00:00:08',
                    },
                    {
                        title: 'Waiting',
                    },
                ]}
            />
            {/* You can add additional content here if needed */}
        </Modal>

    );
}
