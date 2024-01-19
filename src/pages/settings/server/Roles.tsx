import { HelpCircle } from "@styled-icons/boxicons-solid";
import isEqual from "lodash.isequal";
import { observer } from "mobx-react-lite";
import { Server } from "revolt.js";
import styled from "styled-components";
import {Form, Input, InputNumber, Select, Space} from 'antd';
import { Button as AntButton } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const { Option } = Select;
import { Text } from "preact-i18n";
import { useMemo, useState } from "preact/hooks";

import {
    Button,
    PermissionsLayout,
    SpaceBetween,
    H1,
    Checkbox,
    ColourSwatches,
    InputBox,
    Category,
} from "@revoltchat/ui";

import { InputNumberCustom } from "./InputNumberCustom"

import Tooltip from "../../../components/common/Tooltip";
import { PermissionList } from "../../../components/settings/roles/PermissionList";
import { RoleOrDefault } from "../../../components/settings/roles/RoleSelection";
import { modalController } from "../../../controllers/modals/ModalController";
import { reduce } from "lodash";

interface Props {
    server: Server;
}

/**
 * Hook to memo-ize role information.
 * @param server Target server
 * @returns Role array
 */
export function useRoles(server: Server) {
    return useMemo(
        () =>
            [
                // Pull in known server roles.
                ...server.orderedRoles,
                // Include the default server permissions.
                {
                    id: "default",
                    name: "Default",
                    permissions: server.default_permissions,
                },
            ] as RoleOrDefault[],
        [server.roles, server.default_permissions],
    );
}

/**
 * Roles settings menu
 */
export const Roles = observer(({ server }: Props) => {
    // Consolidate all permissions that we can change right now.
    const currentRoles = useRoles(server);
    const [form] = Form.useForm();

    const RoleId = styled.div`
        gap: 4px;
        display: flex;
        align-items: center;

        font-size: 12px;
        font-weight: 600;
        color: var(--tertiary-foreground);

        a {
            color: var(--tertiary-foreground);
        }
    `;

    const DeleteRoleButton = styled(Button)`
        margin: 16px 0;
    `;

    return (
        <PermissionsLayout
            server={server}
            rank={server.member?.ranking ?? Infinity}
            onCreateRole={(callback) =>
                modalController.push({
                    type: "create_role",
                    server,
                    callback,
                })
            }
            editor={({ selected }) => {
                const currentRole = currentRoles.find(
                    (x) => x.id === selected,
                )!;

                if (!currentRole) return null;

                // Keep track of whatever role we're editing right now.
                const [value, setValue] = useState<Partial<RoleOrDefault>>({});

                const currentRoleValue = { ...currentRole, ...value };
                const [form] = Form.useForm();

                // Calculate permissions we have access to on this server.
                const current = server.permission;

                // Upload new role information to server.
                function save() {
                    const { permissions: permsCurrent, ...current } =
                        currentRole;
                    const { permissions: permsValue, ...value } =
                        currentRoleValue;

                    //form validation and if any fields are empty or invalid, don't save
                    form.validateFields().then((values) => {
                        const finalValue = { ...value, ...values };
                        if (!isEqual(permsCurrent, permsValue)) {
                            server.setPermissions(
                                selected,
                                typeof permsValue === "number"
                                    ? permsValue
                                    : {
                                        allow: permsValue.a,
                                        deny: permsValue.d,
                                    },
                            );
                        }
                        if (!isEqual(current, value)) {
                            // console.log("value", value)
                            server.editRole(selected, finalValue);
                        }
                    });
                }

                // Delete the role from this server.
                function deleteRole() {
                    server.deleteRole(selected);
                }

                form.setFieldsValue(currentRoleValue);

                return (
                    <div>
                        <SpaceBetween>
                            <H1>
                                <Text
                                    id="app.settings.actions.edit"
                                    fields={{ name: currentRole.name }}
                                />
                            </H1>
                            <Button
                                palette="secondary"
                                disabled={isEqual(
                                    currentRole,
                                    currentRoleValue,
                                )}
                                onClick={save}>
                                <Text id="app.special.modals.actions.save" />
                            </Button>
                        </SpaceBetween>
                        <hr />
                        <Form
                            form={form}
                            size="large"
                            onFieldsChange={(changedFields, allFields) => {
                                // Transform the array of field objects into an object
                                const fieldsValue = allFields.reduce((acc, field) => {
                                    acc[field.name[0]] = field.value;
                                    return acc;
                                }, {});

                                // Update the value state
                                setValue(prevValue => ({ ...prevValue, ...fieldsValue }));
                            }}
                            name="dynamic_form_nest_item"
                            style={{ width: "100%", marginTop: 20 }}
                        >
                            {selected !== "default" && (
                                <>
                                    <section>
                                        <Category>
                                            <Text id="app.settings.permissions.role_name" />
                                        </Category>
                                        <p>
                                            <InputBox
                                                value={currentRoleValue.name}
                                                onChange={(e) =>
                                                    setValue({
                                                        ...value,
                                                        name: e.currentTarget.value,
                                                    })
                                                }
                                                palette="secondary"
                                            />
                                        </p>
                                    </section>
                                    <section>
                                        <Category>{"Role ID"}</Category>
                                        <RoleId>
                                            <Tooltip
                                                content={
                                                    "This is a unique identifier for this role."
                                                }>
                                                <HelpCircle size={16} />
                                            </Tooltip>
                                            <Tooltip
                                                content={
                                                    <Text id="app.special.copy" />
                                                }>
                                                <a
                                                    onClick={() =>
                                                        modalController.writeText(
                                                            currentRole.id,
                                                        )
                                                    }>
                                                    {currentRole.id}
                                                </a>
                                            </Tooltip>
                                        </RoleId>
                                    </section>
                                    <section>
                                        <Category>
                                            <Text id="app.settings.permissions.role_colour" />
                                        </Category>
                                        <p>
                                            <ColourSwatches
                                                value={
                                                    currentRoleValue.colour ??
                                                    "gray"
                                                }
                                                onChange={(colour) =>
                                                    setValue({ ...value, colour })
                                                }
                                            />
                                        </p>
                                    </section>
                                    <section>
                                        <Category>
                                            <Text id="app.settings.permissions.role_options" />
                                        </Category>
                                        <p>
                                            <Checkbox
                                                value={
                                                    currentRoleValue.hoist ?? false
                                                }
                                                onChange={(hoist) =>
                                                    setValue({ ...value, hoist })
                                                }
                                                title={
                                                    <Text id="app.settings.permissions.hoist_role" />
                                                }
                                                description={
                                                    <Text id="app.settings.permissions.hoist_desc" />
                                                }
                                            />
                                        </p>
                                    </section>
                                    <section>
                                        <Category>
                                            <Text id="app.settings.permissions.role_ranking" />
                                        </Category>
                                        <p>
                                            <InputBox
                                                type="number"
                                                value={currentRoleValue.rank ?? 0}
                                                onChange={(e) =>
                                                    setValue({
                                                        ...value,
                                                        rank: parseInt(
                                                            e.currentTarget.value,
                                                        ),
                                                    })
                                                }
                                                palette="secondary"
                                            />
                                        </p>
                                    </section>
                                    <h1 style={{color:"var(--foreground)"}}>
                                        <Text id="app.settings.permissions.role_requestable" />
                                    </h1>
                                    <section>
                                        <p>
                                            <Checkbox
                                                value={
                                                    currentRoleValue.role_requestable ?? false
                                                }
                                                onChange={(role_requestable) =>
                                                    setValue({ ...value, role_requestable })
                                                }
                                                title={
                                                    <Text id="app.settings.permissions.role_requestable" />
                                                }
                                                description={
                                                    <Text id="app.settings.permissions.role_requestable_desc" />
                                                }
                                            />
                                        </p>
                                        {
                                            currentRoleValue.role_requestable && (
                                                <>
                                                    <Checkbox
                                                        value={
                                                            currentRoleValue.info_required ?? false
                                                        }
                                                        onChange={(info_required) =>
                                                            setValue({ ...value, info_required })
                                                        }
                                                        title={
                                                            <Text id="app.settings.permissions.info_required" />
                                                        }
                                                        description={
                                                            <Text id="app.settings.permissions.info_required_desc" />
                                                        }
                                                    />
                                                    {
                                                        currentRoleValue.info_required && (
                                                                // <Form.Item
                                                                //     label={<Text id="app.settings.permissions.cost" />}
                                                                //     name="cost"
                                                                //     rules={[{ required: true, message: 'Please input the cost' }]}
                                                                //     style={{ width: "100%", marginTop: 20 }}
                                                                // >
                                                                //     <InputNumber
                                                                //         min={0}
                                                                //         formatter={value => `₮ ${value}`}
                                                                //         // parser={value => value.replace(/₮\s?|(,*)/g, '')}
                                                                //         style={{ width: '100%' }}
                                                                //     />
                                                                // </Form.Item>
                                                                <Form.List name="fields">
                                                                    {(fields, { add, remove }) => (
                                                                    <>
                                                                        {fields.map(({ key, name, ...restField }) => (
                                                                        <Space 
                                                                            key={key} 
                                                                            style={{ display: 'flex', marginBottom: 8, width: '100%' }} 
                                                                            align="baseline">
                                                                            <Form.Item
                                                                                {...restField}
                                                                                name={[name, 'field_name']}
                                                                                rules={[{ required: true, message: 'Missing field name' }]}
                                                                            >
                                                                                <Input placeholder="Field Name" />
                                                                            </Form.Item>
                                                                            <Form.Item
                                                                                {...restField}
                                                                                name={[name, 'field_value_name']}
                                                                                rules={[{ required: true, message: 'Missing field value name' }]}
                                                                            >
                                                                                <Input placeholder="Field Value Name" />
                                                                            </Form.Item>
                                                                            <Form.Item
                                                                                {...restField}
                                                                                name={[name, 'field_type']}
                                                                                rules={[{ required: true, message: 'Missing field type' }]}
                                                                                style={{ flexGrow: 1, minWidth: '200px' }}
                                                                            >
                                                                                <Select placeholder="Select a field type"  style={{ width: '100%' }}>
                                                                                    <Option value="text" >Text</Option>
                                                                                    <Option value="number">Number</Option>
                                                                                    {/* Add additional options here as needed */}
                                                                                </Select>
                                                                            </Form.Item>
                                                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                                                        </Space>
                                                                        ))}
                                                                        <Form.Item>
                                                                        <AntButton type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                            <Text id="app.settings.permissions.add_field" />
                                                                        </AntButton>
                                                                        </Form.Item>
                                                                    </>
                                                                    )}
                                                                </Form.List>
                                                        )
                                                    }

                                                    <Checkbox
                                                        value={
                                                            currentRoleValue.payment_required ?? false
                                                        }
                                                        onChange={(payment_required) =>
                                                            setValue({ ...value, payment_required })
                                                        }
                                                        title={
                                                            <Text id="app.settings.permissions.payment_required" />
                                                        }
                                                        description={
                                                            <Text id="app.settings.permissions.payment_required_desc" />
                                                        }
                                                    />
                                                        {currentRoleValue.payment_required && (
                                                            <Form.Item
                                                                label={<Text id="app.settings.permissions.cost" />}
                                                                name="cost"
                                                                rules={[{ required: true, message: 'Please input the cost' }]}
                                                                style={{ width: "100%", marginTop: 20 }}
                                                            >
                                                                <InputNumberCustom
                                                                    min={0}
                                                                    formatter={value => `₮ ${value}`}
                                                                    style={{ fontWeight: 'bold', width: '100%' }}
                                                                />
                                                            </Form.Item>
                                                            )
                                                        }
                                                    <Checkbox
                                                        value={
                                                            currentRoleValue.approvement_required ?? false
                                                        }
                                                        onChange={(approvement_required) =>
                                                            setValue({ ...value, approvement_required })
                                                        }
                                                        title={
                                                            <Text id="app.settings.permissions.approvement_required" />
                                                        }
                                                        description={
                                                            <Text id="app.settings.permissions.approvement_required_desc" />
                                                        }
                                                    />
                                                    {
                                                        currentRoleValue.approvement_required && (
                                                            <Form.Item
                                                                name="approval_roles"
                                                                label={<Text id="app.settings.permissions.approval_roles" />}
                                                                rules={[{ required: true, message: 'Please select a role for approval' }]}
                                                                style={{ width: "100%", marginTop: 20 }} 
                                                            >
                                                                <Select 
                                                                    placeholder="Select a role for approval" 
                                                                    //select many
                                                                    mode="multiple"
                                                                    style={{ width: '100%' }}
                                                                    // onChange handler to do something when a role is selected
                                                                    onChange={(selectedRoleId) => {
                                                                        setValue({
                                                                            ...value,
                                                                            approval_roles: selectedRoleId,
                                                                        })
                                                                    }}>
                                                                    {currentRoles.map(role => (
                                                                        <Option key={role.id} value={role.id}>{role.name}</Option>
                                                                    ))}
                                                                </Select>
                                                            </Form.Item>
                                                        )
                                                    }
                                                    <Checkbox
                                                        value={
                                                            currentRoleValue.expires ?? false
                                                        }
                                                        onChange={(expires) =>
                                                            setValue({ ...value, expires })
                                                        }
                                                        title={
                                                            <Text id="app.settings.permissions.expires" />
                                                        }
                                                        description={
                                                            <Text id="app.settings.permissions.expires_desc" />
                                                        }
                                                    />
                                                    {currentRoleValue.expires && (
                                                        <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                            <Form.Item 
                                                                name="duration"
                                                                label={<Text id="app.settings.permissions.duration" />}
                                                                style={{ marginBottom: 0 }}
                                                                rules={[{ required: true, message: 'Missing field name' }]}
                                                            >
                                                                <InputNumber
                                                                    type="number"
                                                                    min="1"
                                                                    placeholder="Enter duration"
                                                                    style={{colorText: "red"}}
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name="duration_type"
                                                                style={{ width: "100%", marginTop: 20 }}
                                                                rules={[{ required: true, message: 'Missing field name' }]}
                                                                initialValue="months"
                                                                >
                                                                <Select
                                                                    style={{ width: 120 }} // Adjust the width as needed
                                                                    onChange={(selectedType) => {
                                                                        setValue({
                                                                            ...value,
                                                                            duration_type: selectedType,
                                                                        })
                                                                    }}
                                                                >
                                                                    <Option value="months">{<Text id="app.settings.permissions.months" />}</Option>
                                                                    <Option value="years">{<Text id="app.settings.permissions.years" />}</Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Space>
                                                    )}
                                                </>
                                            )
                                        }
                                    </section>
                                </>
                            )}
                        </Form>
                        

                        <h1>
                            <Text id="app.settings.permissions.edit_title" />
                        </h1>
                        <PermissionList
                            value={currentRoleValue.permissions}
                            onChange={(permissions) =>
                                setValue({
                                    ...value,
                                    permissions,
                                } as RoleOrDefault)
                            }
                            target={server}
                        />
                        {selected !== "default" && (
                            <>
                                <hr />
                                <h1>
                                    <Text id="app.settings.categories.danger_zone" />
                                </h1>
                                <DeleteRoleButton
                                    palette="error"
                                    compact
                                    onClick={deleteRole}>
                                    <Text id="app.settings.permissions.delete_role" />
                                </DeleteRoleButton>
                            </>
                        )}
                    </div>
                );
            }}
        />
    );
});
