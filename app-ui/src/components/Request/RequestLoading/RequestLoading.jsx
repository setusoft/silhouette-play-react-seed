// @flow
import React from 'react';
import './RequestLoading.scss';
import Spinner from 'components/Spinner';

type Props = {

}

const RequestLoading = ({}: Props) => {
    return (
        <div className="requestLoadingContainer">
            <Spinner size={20} />
        </div>
    );
};

export default RequestLoading;
