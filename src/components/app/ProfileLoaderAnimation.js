/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

import * as React from 'react';
import { PureComponent } from 'react';
import { Localized } from '@fluent/react';

import explicitConnect from 'firefox-profiler/utils/connect';

import { ProfileRootMessage } from 'firefox-profiler/components/app/ProfileRootMessage';
import { getView } from 'firefox-profiler/selectors/app';
import { getDataSource } from 'firefox-profiler/selectors/url-state';

import type { AppViewState, State, DataSource } from 'firefox-profiler/types';

import type { ConnectedProps } from 'firefox-profiler/utils/connect';

const LOADING_MESSAGES_L10N_ID: { [string]: string } = Object.freeze({
  'from-browser': 'ProfileLoaderAnimation--loading-unpublished',
  unpublished: 'ProfileLoaderAnimation--loading-unpublished',
  'from-file': 'ProfileLoaderAnimation--loading-from-file',
  local: 'ProfileLoaderAnimation--loading-local',
  public: 'ProfileLoaderAnimation--loading-public',
  'from-url': 'ProfileLoaderAnimation--loading-from-url',
  compare: 'ProfileLoaderAnimation--loading-compare',
});

// TODO Switch to a proper i18n library
function fewTimes(count: number) {
  switch (count) {
    case 1:
      return 'once';
    case 2:
      return 'twice';
    default:
      return `${count} times`;
  }
}

type ProfileLoaderAnimationStateProps = {|
  +view: AppViewState,
  +dataSource: DataSource,
|};

type ProfileLoaderAnimationProps = ConnectedProps<
  {||},
  ProfileLoaderAnimationStateProps,
  {||},
>;

class ProfileLoaderAnimationImpl extends PureComponent<ProfileLoaderAnimationProps> {
  render() {
    const { view, dataSource } = this.props;
    const loadingMessage = LOADING_MESSAGES_L10N_ID[dataSource];
    const message = loadingMessage
      ? loadingMessage
      : 'ProfileLoaderAnimation--loading-view-not-found';
    const showLoader = Boolean(loadingMessage);
    const showBackHomeLink = Boolean(
      view.additionalData && view.additionalData.message
    );

    return (
      <Localized id={message} attrs={{ title: true }} elems={{ a: <span /> }}>
        <ProfileRootMessage
          additionalMessage={this._renderAdditionalMessage()}
          showLoader={showLoader}
          showBackHomeLink={showBackHomeLink}
        >{`Untranslated ${message}`}</ProfileRootMessage>
      </Localized>
    );
  }

  _renderAdditionalMessage(): React.Node {
    const { view } = this.props;
    if (!view.additionalData) {
      return null;
    }

    const { message, attempt } = view.additionalData;
    return (
      <>
        {message ? <p>{message}</p> : null}
        {attempt ? (
          <p>{`Tried ${fewTimes(attempt.count)} out of ${attempt.total}.`}</p>
        ) : null}
      </>
    );
  }
}

export const ProfileLoaderAnimation = explicitConnect<
  {||},
  ProfileLoaderAnimationStateProps,
  {||},
>({
  mapStateToProps: (state: State) => ({
    view: getView(state),
    dataSource: getDataSource(state),
  }),
  component: ProfileLoaderAnimationImpl,
});
