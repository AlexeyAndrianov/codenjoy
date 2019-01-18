// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

// proj
import {
    setSelectedDay,
    setSelectedParticipant,
    fetchRating,
} from '../../redux/board';
import { BattleFrame, DaysPanel, RatingTable } from '../../components';

// own
import Styles from './styles.module.css';

const period = {
    start: process.env.REACT_APP_EVENT_START || '2019-01-01T10:00:00.000Z',
    end:   process.env.REACT_APP_EVENT_END || '2019-01-31T10:00:00.000Z',
};

const eventStart = moment(period.start);
const eventEnd = moment(period.end);

class BoardContainer extends Component {
    _isSelectedDateValid(selectedDay) {
        const currentDate = moment(selectedDay);

        return (
            currentDate.isSameOrAfter(eventStart, 'day') &&
            currentDate.isSameOrBefore(eventEnd, 'day')
        );
    }
    componentDidMount() {
        if (this._isSelectedDateValid(this.props.selectedDay)) {
            this.props.fetchRating(this.props.selectedDay);
        }
    }

    render() {
        const { setSelectedDay, setSelectedParticipant } = this.props;
        const { selectedDay, rating, selectedParticipant } = this.props;
        const { email, server } = this.props;

        const ratingContainsEmail = email && _.find(rating, { email });
        const currentParticipant =
            ratingContainsEmail && email && server ? { email, server } : void 0;

        const battleParticipant =
            selectedParticipant || currentParticipant || _.get(rating, 0);

        return (
            <div className={ Styles.boardContainer }>
                <DaysPanel
                    selectedDay={ selectedDay }
                    onDaySelect={ setSelectedDay }
                    period={ period }
                />

                <div className={ Styles.wrapper }>
                    <div className={ Styles.rating }>
                        <RatingTable
                            email={ email }
                            watchEmail={ _.get(battleParticipant, 'email') }
                            rating={ rating }
                            setSelectedParticipant={ setSelectedParticipant }
                        />
                    </div>
                    { moment(selectedDay).isSame(moment(), 'day') && (
                        <div className={ Styles.frame }>
                            <BattleFrame participant={ battleParticipant } />
                        </div>
                    ) }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    selectedDay:         state.board.selectedDay,
    selectedParticipant: state.board.selectedParticipant,
    rating:              state.board.rating,
    email:               state.auth.email,
    server:              state.auth.server,
});

const mapDispatchToProps = {
    setSelectedDay,
    setSelectedParticipant,
    fetchRating,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(BoardContainer);
