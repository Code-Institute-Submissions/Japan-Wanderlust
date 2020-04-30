import React, {useState} from 'react';
import {connect} from "react-redux";
import "./TripBanner.scss";
import TripChooserModal from "./TripChooser/TripChooserModal";
import {Col, Container, Row} from 'reactstrap';
import Button from "reactstrap/es/Button";
import TripUpdate from "./TripModal/TripUpdate";
import {setCurrentTrip} from "./reduxTrip/actions";
import {BrowserView} from "react-device-detect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const TripBanner = ({isUserLoggedIn, currentTrip, setCurrentTrip, currentAttractionCount}) => {

    const [showChooseModal, setShowChooseModal] = useState(false);
    const [showUpdateTrip, setShowUpdateTrip] = useState(false);

    //todo look to use maybe the same conditional for other comp
    if
    (!isUserLoggedIn) {
        return null
    }

    let bannerBody;

    if (!currentTrip) {
        bannerBody =
            <Col id={"no-trip-container"}>
                <Row>
                    <Col>
                        <h1 className={"text-header-important"}>Add your favourite attractions to a trip</h1>
                    </Col>
                </Row>
                <Row id={"trip-banner-button"}>
                    <Button className={"action-button"} onClick={() => setShowChooseModal(true)}>Select a trip</Button>
                </Row>
            </Col>
    }

    if (currentTrip) {
        bannerBody =
            <Col id={"with-trip-container"}>
                <Row>
                    <Col id={"trip-banner-header"}>
                        <div className={"text-header-important"}>{currentTrip.name}</div>
                        <FontAwesomeIcon
                            id={"window-close-icon"}
                            icon="window-close"
                            onClick={() => setCurrentTrip(undefined)}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={"trip-info-icon"}>
                            <FontAwesomeIcon icon="yen-sign"/>
                            {` ${currentTrip.max_price} YEN`}
                        </div>
                        {/*appears only in browser view*/}
                        <BrowserView>
                            <div className={"trip-info-icon"}>
                                <FontAwesomeIcon icon="street-view"/>
                                {currentTrip.is_guided ? " Yes" : " No"}
                            </div>
                        </BrowserView>
                    </Col>
                    <Col id={"attractions-count"}>
                        {currentAttractionCount}
                        <div className={"text-header"}>Attractions</div>
                    </Col>
                    <Col>
                        <div className={"trip-info-icon"}>
                            <FontAwesomeIcon icon={['far', 'calendar-alt']} />
                            {` ${currentTrip.max_trip_days} days`}
                        </div>
                        {/*appears only in browser view*/}
                        <BrowserView>
                            <div className={"trip-info-icon"}>
                                <FontAwesomeIcon icon="users"/>
                                {currentTrip.in_group ? " Yes" : " No"}
                            </div>
                        </BrowserView>
                    </Col>
                </Row>
                <Row>
                    <Col id={"banner-buttons"}>
                        <Button className={"action-button"} onClick={() => setShowUpdateTrip(true)}>Edit trip</Button>
                        <Button className={"action-button"}>Get an offer now!</Button>
                    </Col>
                </Row>
            </Col>

    }

    return (
        <section id={"trip-banner"}>
            <Container fluid>
                <Row>
                    {bannerBody}
                </Row>
            </Container>
            {showChooseModal && <TripChooserModal close={() => setShowChooseModal(false)}/>}
            {showUpdateTrip && <TripUpdate
                close={() => setShowUpdateTrip(false)}
                initialTripName={currentTrip.name}
                initialMaxTripDays={currentTrip.max_trip_days}
                initialIsGuided={currentTrip.is_guided}
                initialInGroup={currentTrip.in_group}
                initialMaxPrice={currentTrip.max_price}
                tripId={currentTrip.id}
                reloadTripInfo={(update) => {
                    setCurrentTrip({
                        ...currentTrip,
                        ...update
                    })
                }}
            />}
        </section>
    )
};

//dispatch will move the provided action dict (result of login(token))
// to the global state and will run the reducer with the provided action
const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentTrip: (trip) => dispatch(setCurrentTrip(trip))
    }
};

//map the global state to properties that are passed into the comp
const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.LoginReducer.loggedIn,
        currentTrip: state.TripReducer.currentTrip,
        currentAttractionCount: state.TripReducer.currentAttractionCount
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = connect(mapStateToProps, mapDispatchToProps)(TripBanner);
export default DefaultApp;