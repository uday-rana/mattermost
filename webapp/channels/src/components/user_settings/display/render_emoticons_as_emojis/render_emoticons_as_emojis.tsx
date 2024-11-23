// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState, useRef, useEffect} from 'react';
import type {ReactNode} from 'react';
import {FormattedMessage} from 'react-intl';

import type {PreferencesType, PreferenceType} from '@mattermost/types/preferences';

import {Preferences} from 'mattermost-redux/constants';

import SettingItemMax from 'components/setting_item_max';
import SettingItemMin from 'components/setting_item_min';
import type SettingItemMinComponent from 'components/setting_item_min';

import {a11yFocus} from 'utils/utils';

export type OwnProps = {
    adminMode?: boolean;
    userId: string;
    userPreferences?: PreferencesType;
}

type Props = OwnProps & {
    active: boolean;
    areAllSectionsInactive: boolean;
    renderEmoticonsAsEmoji: string;
    onUpdateSection: (section?: string) => void;
    renderOnOffLabel: (label: string) => ReactNode;
    actions: {
        savePreferences: (userId: string, preferences: PreferenceType[]) => void;
    };
}

const RenderEmoticonsAsEmojiSection: React.FC<Props> = ({userId, active, areAllSectionsInactive, renderEmoticonsAsEmoji, onUpdateSection, renderOnOffLabel, actions}) => {
    const [renderEmoticonsAsEmojiState, setRenderEmoticonsAsEmojiState] = useState(renderEmoticonsAsEmoji);

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars*/
    const [isSaving, setIsSaving] = useState<boolean>(false);

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars*/
    const [serverError, setServerError] = useState<string | undefined>(undefined);

    const minRef = useRef<SettingItemMinComponent>(null);

    const focusEditButton = () => {
        minRef.current?.focus();
    };

    useEffect(() => {
        if (active && areAllSectionsInactive) {
            focusEditButton();
        }
    }, [active, areAllSectionsInactive]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setRenderEmoticonsAsEmojiState(value);
        a11yFocus(e.currentTarget);
    };

    const handleUpdateSection = (section?: string) => {
        if (!section) {
            setRenderEmoticonsAsEmojiState(renderEmoticonsAsEmoji);
        }
        onUpdateSection(section);
    };

    const handleSubmit = () => {
        const renderEmoticonsAsEmojiPreference = {
            category: Preferences.CATEGORY_DISPLAY_SETTINGS,
            user_id: userId,
            name: Preferences.RENDER_EMOTICONS_AS_EMOJI,
            value: renderEmoticonsAsEmojiState,
        };
        actions.savePreferences(userId, [renderEmoticonsAsEmojiPreference]);
        onUpdateSection();
    };

    if (active) {
        return (
            <SettingItemMax
                title={
                    <FormattedMessage
                        id='user.settings.display.renderEmoticonsAsEmojiTitle'
                        defaultMessage='Auto-render emoticons as emojis'
                    />
                }
                inputs={[
                    <fieldset key='renderEmoticonsAsEmojiSetting'>
                        <legend className='form-legend hidden-label'>
                            <FormattedMessage
                                id='user.settings.display.renderEmoticonsAsEmojiTitle'
                                defaultMessage='Auto-render emoticons as emojis'
                            />
                        </legend>
                        <div className='radio'>
                            <label>
                                <input
                                    id='renderEmoticonsAsEmojiOn'
                                    type='radio'
                                    value='true'
                                    name='renderEmoticonsAsEmoji'
                                    checked={renderEmoticonsAsEmojiState === 'true'}
                                    onChange={handleOnChange}
                                />
                                <FormattedMessage
                                    id='user.settings.display.on'
                                    defaultMessage='On'
                                />
                            </label>
                            <br/>
                        </div>
                        <div className='radio'>
                            <label>
                                <input
                                    id='renderEmoticonsAsEmojiOff'
                                    type='radio'
                                    value='false'
                                    name='renderEmoticonsAsEmoji'
                                    checked={renderEmoticonsAsEmojiState === 'false'}
                                    onChange={handleOnChange}
                                />
                                <FormattedMessage
                                    id='user.settings.display.off'
                                    defaultMessage='Off'
                                />
                            </label>
                            <br/>
                        </div>
                        <div className='mt-5'>
                            <FormattedMessage
                                id='user.settings.display.renderEmoticonsAsEmojiDesc'
                                defaultMessage='When enabled, text emoticons in messages will automatically be rendered as emojis (For example :D as 😄)'
                            />
                        </div>
                    </fieldset>,
                ]}
                setting='renderEmoticonsAsEmoji'
                submit={handleSubmit}
                saving={isSaving}
                serverError={serverError}
                updateSection={handleUpdateSection}
            />
        );
    }

    return (
        <SettingItemMin
            title={
                <FormattedMessage
                    id='user.settings.display.renderEmoticonsAsEmojiTitle'
                    defaultMessage='Auto-render emoticons as emojis'
                />
            }
            describe={renderOnOffLabel(renderEmoticonsAsEmojiState)}
            section='renderEmoticonsAsEmoji'
            updateSection={handleUpdateSection}
            ref={minRef}
        />
    );
};

export default RenderEmoticonsAsEmojiSection;
