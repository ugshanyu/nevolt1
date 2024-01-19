import { Route, Switch } from "react-router-dom";

import { lazy, Suspense } from "preact/compat";

import { Masks, Preloader } from "@revoltchat/ui";

import ErrorBoundary from "../lib/ErrorBoundary";

import Context from "../context";

import { CheckAuth } from "../controllers/client/jsx/CheckAuth";
import Invite from "./invite/Invite";
import { ConfigProvider } from "antd";

const Login = lazy(() => import("./login/Login"));
const ConfirmDelete = lazy(() => import("./login/ConfirmDelete"));
const RevoltApp = lazy(() => import("./RevoltApp"));

const LoadSuspense: React.FC = ({ children }) => (
    // @ts-expect-error Typing issue between Preact and Preact.
    <Suspense fallback={<Preloader type="ring" />}>{children}</Suspense>
);



const customThemeInputNumber = {
    colorText: 'var(--foreground)',
    background: 'var(--secondary-background)',
    activeBg: 'var(--secondary-background)',
    colorBgContainer: 'var(--secondary-background)',
    border: 'none',
    colorBorder: 'transparent',
    handleHoverColor: 'var(--accent)',
    activeBorderColor: 'var(--accent)',
    colorPrimary: 'var(--accent)',
    hoverBg: 'var(--hover)',
    colorPrimaryHover: 'transparent',
    colorTextPlaceholder: 'var(--tertiary-foreground)',
    inputFontSize: '0.9375rem',
    // fontFamily: 'var(--font)',
    // controlHeight: 52,
    // fontWeight: '600',
    // lineHeight: '2.5',
};

const customThemeForm = {
    fontWeight: '900',
    fontFamily: 'Open Sans',
    labelColor: 'var(--foreground)',
    labelFontSize: '0.9375rem',
    labelColonMarginInlineStart: '12',
    labelHeight: "123",
    // itemMarginBottom: '12px',
}

const customThemeSelect = {
    colorText: 'var(--foreground)',
    multipleItemBg: 'var(--accent)',
    optionSelectedBg: 'var(--accent)',
    // optionSelectedColor: 'var(--foreground)',
    // selectorBg: 'var(--secondary-background)',
    // clearBg: 'var(--secondary-background)',
    optionActiveBg: 'var(--accent)',
    // colorBgContainer: 'var(--secondary-background)',
    colorBgElevated: 'var(--secondary-background)',
    colorBgContainer: 'var(--secondary-background)',
    colorTextPlaceholder: 'var(--tertiary-foreground)',
    border: 'none',
    colorBorder: 'transparent',
    colorPrimaryHover: 'var(--hover)',
    colorTextDescription: 'var(--accent)',
    colorIcon: 'var(--accent)',
    colorSplit: 'var(--accent)',
    colorTextQuaternary: 'var(--accent)',
    // colorTextTertiary: 'var(--accent)',
    // lineHeight: '2.5',
    // inputFontSize: '0.9375rem',
    // controlHeight: 52,

};

const customThemeButton = {
    colorText: 'var(--foreground)',
    background: 'var(--accent)',
    colorBgContainer: 'var(--secondary-background)',
    border: 'none',
    colorBorder: 'transparent',
    colorPrimaryHover: 'var(--foreground)',
    colorPrimaryActive: 'var(--accent)',
    // lineHeight: '2.5',
    // inputFontSize: '0.9375rem',
    // controlHeight: 52,
}



export function App() {
    return (
        <ConfigProvider
            theme={{
                components: {
                Button: customThemeButton,
                InputNumber: customThemeInputNumber,
                Form: customThemeForm,
                Select: customThemeSelect,
                },
            }}
            >
            <ErrorBoundary section="client">
                <Context>
                    <Masks />
                    <Switch>
                        <Route path="/login/verify/:token">
                            <LoadSuspense>
                                <Login />
                            </LoadSuspense>
                        </Route>
                        <Route path="/login/reset/:token">
                            <LoadSuspense>
                                <Login />
                            </LoadSuspense>
                        </Route>
                        <Route path="/delete/:token">
                            <LoadSuspense>
                                <ConfirmDelete />
                            </LoadSuspense>
                        </Route>
                        <Route path="/invite/:code">
                            <CheckAuth blockRender>
                                <Invite />
                            </CheckAuth>
                            <CheckAuth auth blockRender>
                                <Invite />
                            </CheckAuth>
                        </Route>
                        <Route path="/login">
                            <CheckAuth>
                                <LoadSuspense>
                                    <Login />
                                </LoadSuspense>
                            </CheckAuth>
                        </Route>
                        <Route path="/">
                            <CheckAuth auth>
                                <LoadSuspense>
                                    <RevoltApp />
                                </LoadSuspense>
                            </CheckAuth>
                        </Route>
                    </Switch>
                </Context>
            </ErrorBoundary>
        </ConfigProvider>
    );
}
