import { Modal, Steps, Select, Button, Form, Input, notification } from 'antd';
import { Text } from 'preact-i18n';
import { useEffect, useState } from 'preact/hooks';
import type { NotificationArgsProps } from 'antd';

const { Option } = Select;

type NotificationPlacement = NotificationArgsProps['placement'];
type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function RetrieveRole({ server, ...props }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showModal, setShowModal] = useState(true);
    const [selectedRole, setSelectedRole] = useState(null);
    const [form] = Form.useForm();
    const [steps, setSteps] = useState([{ title: "Select a role" }, { title: "Fill out the form" }]);
    const [bank, setBank] = useState(false);

    const selectRoles = () => (
        <Form.Item
            name="role"
            label={<Text id="app.special.modals.role_request.role_request" />}
            rules={[{ required: true, message: 'Please select a role!' }]}
        >
            <Select placeholder="Select a role" style={{ width: '100%' }} onChange={(value) => {
                // Find the role object that matches the selected value (ID)
                const roleObj = server?.orderedRoles?.find(role => role.id === value);
                setSelectedRole(roleObj);
            }}>
                {server?.orderedRoles?.map(role => (
                    <Option key={role.id} value={role.id}>{role.name}</Option>
                ))}
            </Select>
        </Form.Item>
    );


    const fillForm = () => (
        <div>
            <Form.Item
                name="schoolName"
                label={<Text id="app.special.modals.role_request.enter_school" />}
                rules={[{ required: true, message: 'Please input your name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="grade"
                label={<Text id="app.special.modals.role_request.enter_grade" />}
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input />
            </Form.Item>
        </div>
    )

    const [formItems, setFormItems] = useState([selectRoles, fillForm]);

    const paymentForm = () => (
        <div>
            <Form.Item
                name="card"
                label="Card"
                rules={[{ required: true, message: 'Please input your card number!' }]}
            >
                <Select placeholder="Select a role" style={{ width: '100%' }} onChange={(value) => { setBank(true) }}>
                    <Option key={1} value={'socialPay'}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img src="https://socialpay.mn/fav.png" style={{ width: "1.5rem", height: "1.5rem", marginRight: "0.3rem", borderRadius: "5%" }} /> 
                            <span style={{ fontWeight: 600 }}>Social Pay</span>
                        </div>
                    </Option>
                    <Option key={2} value={'qPay'}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <svg style={{ marginRight: "0.3rem" }} class="bi me-2" width="3rem" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 186.7 73.6"><path d="M111.4 13.5c3.1 2.8 4.7 7 4.7 12.4s-1.6 9.5-4.7 12.4-7.3 4.3-12.4 4.3h-5.9V58c-1.8.3-3.6.5-5.5.4-1.8 0-3.6-.1-5.4-.4V10l.5-.5c7.9-.2 13.3-.3 16.2-.3 5.2.1 9.4 1.5 12.5 4.3zm-18.3 4v17c1.4 0 3-.1 4.9-.1 1.6.1 3.2-.4 4.5-1.5 1-.8 1.7-1.9 2.1-3.1.3-1.5.5-2.9.5-4.4 0-1.9-.5-3.7-1.5-5.2-1.1-1.7-3-2.7-5-2.5-2.4-.1-4.2-.1-5.5-.2zM150.9 53.2c-.3 1.1-.7 2.1-1.3 3-.5.9-1.2 1.7-2 2.4-2.9 0-5.7-1.4-7.4-3.8-2.6 2.7-6.2 4.2-10 4.2-3.7 0-6.4-1.1-8.3-3.3-1.8-2-2.8-4.7-2.8-7.4 0-4 1.3-7 4-9.1 2.9-2.2 6.4-3.3 10-3.1 1.6 0 3.3.1 5.3.2v-1.5c0-3.1-1.6-4.7-4.8-4.7-2 0-5.5.8-10.6 2.3-1.4-1.6-2.3-4.1-2.6-7.4 2.5-1 5.2-1.8 7.9-2.3 2.6-.5 5.3-.8 8-.8 3.2-.1 6.4.9 8.9 2.9 2.4 2 3.6 5 3.6 9.1v14.4c.1 2.4.7 3.9 2.1 4.9zm-18.1-1.9c2.1-.1 4-.9 5.5-2.3v-5.9c-1 0-2.4-.1-4.2-.1-3.2 0-4.7 1.6-4.7 4.7 0 .9.4 1.8 1 2.5s1.5 1.1 2.4 1.1zM186.7 23.9l-8.9 33.2c-1.5 5.5-3.4 9.7-5.9 12.4-2.5 2.7-6.2 4.1-11.2 4.1-2.8 0-5.7-.5-8.4-1.4v-1.3c.1-1 .2-2 .5-3 .3-1.2.8-2.3 1.6-3.2 2 .6 4.1 1 6.2 1.1 3.5 0 5.9-2.1 7.1-6.2l.3-1c-4-.1-6.3-1.6-7.1-4.4l-8.4-30.6c1.8-.9 3.8-1.4 5.8-1.4 1.4-.1 2.8.2 3.9 1 1 1 1.6 2.2 1.8 3.5l3.5 14c.4 1.4.9 4.5 1.7 9.4 0 .3.3.5.6.5l6.4-27.8c1.5-.3 3.1-.5 4.6-.4 1.8 0 3.5.2 5.2.8l.7.7zM52.6 52.2l3.8 3.8c1.5-1.5 2.8-3.1 3.9-4.8l-4.4-2.9c-1 1.4-2.1 2.7-3.3 3.9z"></path><path d="M65.8 32.9v-.2c0-2.1-.2-4.1-.7-6.2V26C61.9 11 48.7.2 33.3 0h-.4C14.7 0 0 14.7 0 32.9s14.7 32.9 32.9 32.9c3.3 0 6.5-.5 9.6-1.4l1.1-.3 2.1-.8 2.6 1 8.5 3.3c1.4.6 1.8 0 .9-1.2L44.1 48c-1-1.3-2.7-1.7-4.1-1-2.2 1.1-4.6 1.7-7 1.8-8.8 0-16-7.1-16.1-15.9s7.1-16 15.9-16.1c7.6 0 14.2 5.3 15.7 12.7v.5c.2.9.2 1.8.3 2.7v.3c0 1-.1 1.9-.3 2.9l5.4 1c.2-1.3.4-2.6.4-3.9v-.2h6.2v.2c0 1.7-.1 3.4-.4 5.1v.2h-.2l-5.6-1.1c-.3 1.3-.7 2.6-1.2 3.9l-.1.2-.2-.1-5-2.1c-.4.9-.8 1.7-1.4 2.5l-.1.2c-.5.8-1.2 1.5-1.8 2.2l3.9 3.8c.9-.9 1.8-2 2.5-3.1l.1-.2.2.1 4.8 3.2c.9-1.4 1.7-2.9 2.4-4.5l.1-.2.2.1 4.9 2c.8-1.9 1.4-3.9 1.8-5.9v-.2c.2-2.1.4-4.1.4-6.2z"></path></svg>
                            <span style={{ fontWeight: 600 }}>QPay</span>
                        </div>
                    </Option>
                </Select>
            </Form.Item>
        </div>
    )

    useEffect(() => {
        if(selectedRole?.payment_required) {
            let newSteps = steps;
            newSteps.push({ title: "Payment" });
            setSteps(newSteps);
            let newFormItems = formItems;
            newFormItems.push(paymentForm);
            setFormItems(newFormItems);
        }
    }, [selectedRole]);

    const handleNext = () => {
        form.validateFields()
            .then(() => {
                setCurrentStep(currentStep + 1);
            })
            .catch((errorInfo) => {
                console.log('Validation Failed:', errorInfo);
            });
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (placement: NotificationPlacement, type: NotificationType = 'success') => {
        api[type]({
        message: `Notification ${placement}`,
        description:
            'Successfully requested role!',
        placement,
        duration: 3,
        });
    };

    return (
        <>
        {contextHolder}
        <Modal
            {...props}
            title={<Text id="app.special.modals.role_request.role_request" />}
            open={showModal}
            onCancel={() => setShowModal(false)}
            footer={[
                <Button key="back" onClick={handlePrev} disabled={currentStep === 0}>
                    Previous
                </Button>,
                currentStep < steps.length - 1 && (
                    <Button key="next" onClick={handleNext} type="primary">
                        Next
                    </Button>
                ),
                currentStep === steps.length - 1 && (
                    <Button key="submit" onClick={() => {
                        openNotification('top');
                        setShowModal(false);
                    }} type="primary">
                        Submit
                    </Button>
                )
            ]}
        >
            <Steps current={currentStep} items={steps} onChange={(step) => setCurrentStep(step)} style={{ marginBottom: "1.3rem", finishIconColor: "red" }} />
            <Form layout="vertical" form={form} size='large'>
                {formItems[currentStep] && formItems[currentStep]()}
            </Form>
            {
                bank != false && currentStep == steps.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem" }}>
                        <img src={`https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg`} style={{ width: "300px" }} />
                    </div>
                )
            }
        </Modal>
        </>
    );
}
