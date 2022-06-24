import React from 'react';
import { Colors } from '@test/ui';
import SFProBold from '../assets/fonts/SFProDisplay-Bold.ttf'
import SFProSemiBold from '../assets/fonts/SFProDisplay-SemiBold.ttf'
import SFProRegular from '../assets/fonts/SFProDisplay-Regular.ttf'
import IOrder from '@test/models/.dist/interfaces/IOrder';
import { IEventGraphQL } from '@test/models/.dist/interfaces/IEvent';
import * as Time from '@test/utils/.dist/time';
import IPerformance from '@test/models/.dist/interfaces/IPerformance';
import { OrderItemStateEnum } from '@test/models/.dist/interfaces/IOrderState';
import * as Primitives from '@react-pdf/primitives';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
  Font,
} from '@react-pdf/renderer'; // https://github.com/diegomura/react-pdf/pull/617 -using beta version of library for now for svg support, should switch when this PR gets merged to master
import { useMutation } from "@apollo/react-hooks";
import { ApolloError } from "@apollo/client";
import BREAK_APART_ORDER from '@test/models/.dist/graphql/mutations/breakApartOrder';
import shortid from 'shortid';

// VerticalNormal works for the Zebra printers that we tested
// HorizontalNormal works for the Boca printers that we tested
export enum PrintedItemOrientationTypes {
  HorizontalNormal = 'HorizontalNormal',
  HorizontalReverse = 'HorizontalReverse',
  VerticalNormal = 'VerticalNormal',
  VerticalReverse = 'VerticalReverse',
};

Font.register({
  family: "SFBold",
  format: "truetype",
  src: SFProBold,
});

Font.register({
  family: "SFSemiBold",
  format: "truetype",
  src: SFProSemiBold,
});

Font.register({
  family: "SFRegular",
  format: "truetype",
  src: SFProRegular,
});

// There doesn't seem to be a super simple way to rotate the pdf pages without weird behavior
// so we have two separate style sheets for vertical and horizontal orientations.
// Could possibly be more succinct but this stuff is finicky and annoying to test.
const getStyles = (orientation: PrintedItemOrientationTypes) => {
  if (orientation === PrintedItemOrientationTypes.VerticalNormal || orientation === PrintedItemOrientationTypes.VerticalReverse) {
    return (
      StyleSheet.create({
        container: {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: `${Colors.White}`,
          transform: `${orientation === PrintedItemOrientationTypes.VerticalNormal ? 'rotate(0deg)' : 'rotate(180deg)'}`
        },
        qrCodeContainer: {
          width: '100%',
          height: '2in',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
        },
        qrCode: {
          width: '100%',
          height: '100%',
          transform: 'rotate(90deg)',
        },
        eventInfoContainer: {
          width: '100%',
          height: '2.5in',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        eventInfoRotatedContainer: {
          width: '2.5in',
          height: '2in',
          transform: 'rotate(90deg)',
          display: 'flex',
          justifyContent: 'center',
        },
        eventInfoItemContainer: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 4,
        },
        eventInfoItem: {
          fontFamily: 'SFRegular',
          fontSize: 10,
          marginLeft: 5,
          maxLines: 1,
          textOverflow: 'ellipsis',
        },
        eventName: {
          fontFamily: 'SFBold',
          fontSize: 12,
          marginBottom: 4,
          maxLines: 1,
          textOverflow: 'ellipsis',
        },
        subtitle: {
          fontFamily: 'SFSemiBold',
          fontSize: 10,
          marginBottom: 5,
          maxLines: 1,
          textOverflow: 'ellipsis',
        },
        promoter: {
          fontFamily: 'SFRegular',
          fontSize: 8,
          marginBottom: 3,
          maxLines: 1,
          textOverflow: 'ellipsis',
        },
        orderItemContainer: {
          width: '100%',
          height: '1in',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          paddingLeft: 10,
          paddingRight: 10,
        },
        orderItemRotatedContainer: {
          display: 'flex',
          alignItems: 'center',
        },
        orderItemText: {
          fontSize: 10,
          fontFamily: 'SFRegular',
          marginLeft: 3,
          maxLines: 1,
          textOverflow: 'ellipsis',
        },
        bottomOrderItem: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        icon: {
          height: 'auto',
          width: 10,
        }
      })
    );
  } else {
    return (
      StyleSheet.create({
        container: {
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: `${Colors.White}`,
          transform: `${orientation === PrintedItemOrientationTypes.HorizontalNormal ? 'rotate(0deg)' : 'rotate(180deg)'}`
        },
        qrCodeContainer: {
          width: '2in',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
        },
        qrCode: {
          width: '100%',
          height: '100%',
        },
        eventInfoContainer: {
          width: '2.5in',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        eventInfoRotatedContainer: {
          width: '100%',
        },
        eventInfoItemContainer: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 4,
        },
        eventInfoItem: {
          fontFamily: 'SFRegular',
          fontSize: 10,
          marginLeft: 5,
          maxLines: 1,
          textOverflow: 'ellipsis',
        },
        eventName: {
          fontFamily: 'SFBold',
          fontSize: 12,
          marginBottom: 4,
          maxLines: 1,
          textOverflow: 'ellipsis',
        },
        subtitle: {
          fontFamily: 'SFSemiBold',
          fontSize: 10,
          marginBottom: 5,
          maxLines: 1,
          textOverflow: 'ellipsis',
        },
        promoter: {
          fontFamily: 'SFRegular',
          fontSize: 8,
          marginBottom: 3,
          maxLines: 1,
          textOverflow: 'ellipsis',
        },
        orderItemContainer: {
          width: '1in',
          height: '2in',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          paddingLeft: 10,
          paddingRight: 10,
        },
        orderItemRotatedContainer: {
          transform: 'rotate(-90deg)',
          width: '2in',
          display: 'flex',
          alignItems: 'center',
        },
        orderItemText: {
          fontSize: 10,
          fontFamily: 'SFRegular',
          marginLeft: 3,
          maxLines: 1,
          textOverflow: 'ellipsis',
        },
        bottomOrderItem: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        icon: {
          height: 'auto',
          width: 10,
        }
      })
    );
  }
}

// svg file types not yet supported by @react-pdf/renderer so we have to do it this way for now
const CalendarSVG = (orientation: PrintedItemOrientationTypes) => (
  <Primitives.Svg style={getStyles(orientation).icon} transform="rotate(90deg)" transform-origin="50% 50%" width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Primitives.Path d="M1.5 1.125L1.5 2.25H0.1875C0.09375 2.25 0 2.34375 0 2.4375L0 2.8125C0 2.92969 0.09375 3 0.1875 3H1.5L1.5 7.5H0.1875C0.09375 7.5 0 7.59375 0 7.6875V8.0625C0 8.17969 0.09375 8.25 0.1875 8.25H1.5L1.5 9.375C1.5 10.0078 2.01562 10.5 2.625 10.5L10.875 10.5C11.5078 10.5 12 10.0078 12 9.375L12 1.125C12 0.515625 11.5078 0 10.875 0L2.625 0C2.01563 0 1.5 0.515625 1.5 1.125ZM10.875 0.75C11.0859 0.75 11.25 0.9375 11.25 1.125L11.25 9.375C11.25 9.58594 11.0859 9.75 10.875 9.75L4.5 9.75L4.5 0.75L10.875 0.75ZM3.75 0.75L3.75 9.75H2.625C2.4375 9.75 2.25 9.58594 2.25 9.375L2.25 1.125C2.25 0.9375 2.4375 0.75 2.625 0.75H3.75ZM9 7.875V5.625C9 5.4375 8.83594 5.25 8.625 5.25H6.375C6.1875 5.25 6 5.4375 6 5.625L6 7.875C6 8.08594 6.1875 8.25 6.375 8.25L8.625 8.25C8.83594 8.25 9 8.08594 9 7.875ZM6.75 7.5L6.75 6H8.25V7.5H6.75Z" fill="black"/>
  </Primitives.Svg>
);

const ClockSVG = (orientation: PrintedItemOrientationTypes) => (
  <Primitives.Svg style={getStyles(orientation).icon} transform="rotate(90deg)" transform-origin="50% 50%" width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Primitives.Path d="M0.6875 6C0.6875 9.21094 3.28906 11.8125 6.5 11.8125C9.71094 11.8125 12.3125 9.21094 12.3125 6C12.3125 2.78906 9.71094 0.1875 6.5 0.1875C3.28906 0.1875 0.6875 2.78906 0.6875 6ZM6.5 0.9375C9.28906 0.9375 11.5625 3.21094 11.5625 6C11.5625 8.78906 9.3125 11.0625 6.5 11.0625C3.73438 11.0625 1.4375 8.8125 1.4375 6C1.4375 3.23438 3.71094 0.9375 6.5 0.9375ZM8.58594 4.42969C8.67969 4.3125 8.63281 4.125 8.51563 4.05469L8.25781 3.84375C8.11719 3.75 7.95313 3.79688 7.85938 3.91406L6.66406 5.55469L3.21875 5.55469C3.07813 5.55469 2.9375 5.69531 2.9375 5.83594V6.16406C2.9375 6.32812 3.07813 6.44531 3.21875 6.44531L6.96875 6.44531C7.0625 6.44531 7.13281 6.42188 7.20313 6.35156L8.58594 4.42969Z" fill="black"/>
  </Primitives.Svg>
);

const LocationSVG = (orientation: PrintedItemOrientationTypes) => (
  <Primitives.Svg style={getStyles(orientation).icon} transform="rotate(90deg)" transform-origin="50% 50%" width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Primitives.Path d="M2.25 5C2.25 6.24219 3.28125 7.25 4.5 7.25C5.74219 7.25 6.75 6.24219 6.75 5C6.75 3.78125 5.74219 2.75 4.5 2.75C3.28125 2.75 2.25 3.78125 2.25 5ZM6 5C6 5.84375 5.34375 6.5 4.5 6.5C3.67969 6.5 3 5.84375 3 5C3 4.17969 3.67969 3.5 4.5 3.5C5.34375 3.5 6 4.17969 6 5ZM0 5C0 7.50781 2.01562 9.5 4.5 9.5C6.32812 9.5 6.84375 8.89062 11.7656 5.46875C12.0938 5.25781 12.0938 4.76563 11.7656 4.55469C6.84375 1.13281 6.32813 0.5 4.5 0.5C2.01563 0.5 0 2.51562 0 5ZM11.1094 5C6.39844 8.28125 6.02344 8.75 4.5 8.75C3.51562 8.75 2.57812 8.375 1.85156 7.67188C1.14844 6.94531 0.75 6.00781 0.75 5C0.75 4.01562 1.14844 3.07812 1.85156 2.35156C2.57813 1.64844 3.51563 1.25 4.5 1.25C6.02344 1.25 6.39844 1.74219 11.1094 5Z" fill="black"/>
  </Primitives.Svg>
);

const TicketSVG = (orientation: PrintedItemOrientationTypes) => (
  <Primitives.Svg style={getStyles(orientation).icon} transform="rotate(90deg)" transform-origin="50% 50%" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Primitives.Path d="M8.28125 2.375L2.96875 2.375C2.69531 2.375 2.5 2.58984 2.5 2.84375V5.65625C2.5 5.92969 2.69531 6.125 2.96875 6.125L8.28125 6.125C8.53516 6.125 8.75 5.92969 8.75 5.65625V2.84375C8.75 2.58984 8.53516 2.375 8.28125 2.375ZM8.125 5.5L3.125 5.5V3L8.125 3V5.5ZM10.625 3.625H11.25V1.4375C11.25 0.929688 10.8203 0.5 10.3125 0.5L0.9375 0.5C0.410156 0.5 0 0.929688 0 1.4375L0 3.625H0.625C0.957031 3.625 1.25 3.91797 1.25 4.25C1.25 4.60156 0.957031 4.875 0.625 4.875H0L0 7.0625C0 7.58984 0.410156 8 0.9375 8H10.3125C10.8203 8 11.25 7.58984 11.25 7.0625V4.875H10.625C10.2734 4.875 10 4.60156 10 4.25C10 3.91797 10.2734 3.625 10.625 3.625ZM10.625 5.5V7.0625C10.625 7.23828 10.4688 7.375 10.3125 7.375H0.9375C0.761719 7.375 0.625 7.23828 0.625 7.0625V5.5C1.30859 5.5 1.875 4.95312 1.875 4.25C1.875 3.56641 1.30859 3 0.625 3L0.625 1.4375C0.625 1.28125 0.761719 1.125 0.9375 1.125L10.3125 1.125C10.4688 1.125 10.625 1.28125 10.625 1.4375V3C9.92188 3 9.375 3.56641 9.375 4.25C9.375 4.95313 9.92188 5.5 10.625 5.5Z" fill="black"/>
  </Primitives.Svg>
);

const UpgradeSVG = (orientation: PrintedItemOrientationTypes) => (
  <Primitives.Svg style={getStyles(orientation).icon} transform="rotate(90deg)" transform-origin="50% 50%" width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Primitives.Path d="M11.25 9.875L11.25 1.625C11.25 1.01563 10.7578 0.5 10.125 0.5L1.875 0.5C1.26563 0.5 0.75 1.01562 0.75 1.625L0.75 9.875C0.75 10.5078 1.26562 11 1.875 11L10.125 11C10.7578 11 11.25 10.5078 11.25 9.875ZM1.875 10.25C1.6875 10.25 1.5 10.0859 1.5 9.875L1.5 1.625C1.5 1.4375 1.6875 1.25 1.875 1.25L10.125 1.25C10.3359 1.25 10.5 1.4375 10.5 1.625L10.5 9.875C10.5 10.0859 10.3359 10.25 10.125 10.25L1.875 10.25ZM6.75 8.75L6.75 7.25L9.1875 7.25C9.51562 7.25 9.75 7.01563 9.75 6.6875V4.8125C9.75 4.50781 9.51562 4.25 9.1875 4.25H6.75V2.75C6.75 2.09375 5.95313 1.76562 5.48438 2.23438L2.48438 5.23438C2.17969 5.51562 2.17969 6.00781 2.48438 6.28906L5.48438 9.28906C5.95312 9.75781 6.75 9.42969 6.75 8.75ZM3 5.75L6 2.75V5H9V6.5H6L6 8.75L3 5.75Z" fill="black"/>
  </Primitives.Svg>
);

const ChairSVG = (orientation: PrintedItemOrientationTypes) => (
  <Primitives.Svg style={getStyles(orientation).icon} transform="rotate(90deg)" transform-origin="50% 50%" width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Primitives.Path d="M8.51562 0.296875L7.01562 0.8125C6.71094 0.929687 6.5 1.21094 6.5 1.53906L6.5 1.75L3.5 1.75C1.85937 1.75 0.5 3.10937 0.5 4.75L0.5 6.25C0.5 7.91406 1.85937 9.25 3.5 9.25L6.5 9.25L6.5 9.48437C6.5 9.8125 6.71094 10.0937 7.01562 10.1875L8.51562 10.7266C9.00781 10.8906 9.5 10.5156 9.5 10L12.3125 10C12.4297 10 12.5 9.92969 12.5 9.8125L12.5 9.4375C12.5 9.34375 12.4297 9.25 12.3125 9.25L9.5 9.25L9.5 1.75L12.3125 1.75C12.4297 1.75 12.5 1.67969 12.5 1.5625L12.5 1.1875C12.5 1.09375 12.4297 0.999999 12.3125 0.999999L9.5 1C9.5 0.484375 9.00781 0.132812 8.51562 0.296875ZM1.39062 4C1.71875 3.13281 2.53906 2.5 3.5 2.5L6.5 2.5L6.5 4L1.39062 4ZM1.25 6.25L1.25 4.75L6.5 4.75L6.5 6.25L1.25 6.25ZM3.5 8.5C2.53906 8.5 1.71875 7.89062 1.39062 7L6.5 7L6.5 8.5L3.5 8.5ZM8.75 10L7.25 9.48437L7.25 1.53906L8.75 1L8.75 10Z" fill="black"/>
  </Primitives.Svg>
);

interface IOrderGraphQL extends IOrder {
  event: IEventGraphQL;
};

type OrderItemToPrint = {
  order: IOrderGraphQL;
  orientation: PrintedItemOrientationTypes;
};

const OrderItemToPrint: React.FC<OrderItemToPrint> = ({ order, orientation }) => {
  // 72 is the dpi for 1 inch of the pdf
  const INCH = 72;
  let ticketWidth = 5.5 * INCH;
  let ticketHeight = 2 * INCH;
  // we need to reverse the width and height when ticket is vertical
  if (orientation === PrintedItemOrientationTypes.VerticalNormal || orientation === PrintedItemOrientationTypes.VerticalReverse) {
    ticketWidth = 2 * INCH;
    ticketHeight = 5.5 * INCH;
  }

  // calculate variables
  const presentedBy = `${order.event.organization?.orgName?.toUpperCase() ?? 'test'} PRESENTS`;
  const eventName = `${order.event.name || 'No Event Name'}`;
  const eventSubtitle = order.event.subtitle;
  const performance: IPerformance = order.event?.performances?.[0] as IPerformance;
  const eventDate = Time.format(
    performance?.schedule?.startsAt,
    "ddd, MMM DD, YYYY"
  );  const eventDoors = Time.format(
    performance?.schedule?.doorsAt,
    "[Doors @] h:mma"
  );
  const eventShow = Time.format(
    performance?.schedule?.startsAt,
    "[show @] h:mma"
  );
  const a = order.event.venue?.address;
  const location = `${order.event.venue?.name || ''}${a ? `, ${a.city}, ${a.state}` : ''}`;

  const styles = getStyles(orientation);

  /**
   * Map through active tickets and upgrades and and format accordingly for supported ticket stock
   */
  return (
    <Document>
      {order.tickets.filter(ticket => ticket.state === OrderItemStateEnum.Active).map((ticket, index) => (
        <Page
          size={{width: ticketWidth, height: ticketHeight}}
          style={styles.container}
          key={index}
        >
          <View style={styles.qrCodeContainer}>
            <Image
              style={styles.qrCode}
              src={ticket.qrCodeUrl as string}
            />
          </View>
          <View style={styles.eventInfoContainer}>
            <View style={styles.eventInfoRotatedContainer}>
              <Text style={styles.promoter}>
                {presentedBy}
              </Text>
              <Text style={styles.eventName}>
                {eventName}
              </Text>
              {(()=> { // library breaks on toBlob() if we use the more simple syntax of {eventSubtitle && ... }
                if (eventSubtitle) {
                  return (
                    <Text style={styles.subtitle}>
                      {eventSubtitle}
                    </Text>
                  );
                } else {
                  return null;
                }
              })()}
              <View style={styles.eventInfoItemContainer}>
                {CalendarSVG(orientation)}
                <Text style={styles.eventInfoItem}>
                  {eventDate}
                </Text>
              </View>
              <View style={styles.eventInfoItemContainer}>
                {ClockSVG(orientation)}
                <Text style={styles.eventInfoItem}>
                  {`${eventDoors} ${eventShow}`}
                </Text>
              </View>
              <View style={styles.eventInfoItemContainer}>
                {LocationSVG(orientation)}
                <Text style={styles.eventInfoItem}>
                  {location}
                </Text>
              </View>
              <View style={[styles.eventInfoItemContainer, { marginBottom: 0 }]}>
                {TicketSVG(orientation)}
                <Text style={styles.eventInfoItem}>
                  {ticket.seat ? `Seat ${ticket.seat}` : ticket.name}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.orderItemContainer}>
            <View style={styles.orderItemRotatedContainer}>
              <Text style={styles.subtitle}>
                {eventName}
              </Text>
              <View style={styles.bottomOrderItem}>
                {ticket.seat ? ChairSVG(orientation) : TicketSVG(orientation)}
                <Text style={styles.orderItemText}>
                  {ticket.seat ? `Seat ${ticket.seat}` : ticket.name}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      ))}
      {order.upgrades.filter(upgrade => upgrade.state === OrderItemStateEnum.Active).map((upgrade, index) => (
        <Page
          size={{width: ticketWidth, height: ticketHeight}}
          style={styles.container}
          key={index}
        >
          <View style={styles.qrCodeContainer}>
            <Image
              style={styles.qrCode}
              src={upgrade.qrCodeUrl as string}
            />
          </View>
          <View style={styles.eventInfoContainer}>
            <View style={styles.eventInfoRotatedContainer}>
              <Text style={styles.promoter}>
                {presentedBy}
              </Text>
              <Text style={styles.eventName}>
                {eventName}
              </Text>
              {(()=> { // library breaks on toBlob() if we use the more simple syntax of {eventSubtitle && ... }
                if (eventSubtitle) {
                  return (
                    <Text style={styles.subtitle}>
                      {eventSubtitle}
                    </Text>
                  );
                } else {
                  return null
                }
              })()}
              <View style={styles.eventInfoItemContainer}>
                {CalendarSVG(orientation)}
                <Text style={styles.eventInfoItem}>
                  {eventDate}
                </Text>
              </View>
              <View style={styles.eventInfoItemContainer}>
                {ClockSVG(orientation)}
                <Text style={styles.eventInfoItem}>
                  {`${eventDoors} ${eventShow}`}
                </Text>
              </View>
              <View style={styles.eventInfoItemContainer}>
                {LocationSVG(orientation)}
                <Text style={styles.eventInfoItem}>
                  {location}
                </Text>
              </View>
              <View style={[styles.eventInfoItemContainer, { marginBottom: 0 }]}>
                {UpgradeSVG(orientation)}
                <Text style={styles.eventInfoItem}>
                  {upgrade.name}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.orderItemContainer}>
            <Text style={styles.subtitle}>
              {eventName}
            </Text>
            <View style={styles.bottomOrderItem}>
              {UpgradeSVG(orientation)}
              <Text style={styles.orderItemText}>
                {upgrade.name}
              </Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}

/**
 * 
 */
const printOrderItems = async (order: IOrderGraphQL, iFrameId: string, orientation: PrintedItemOrientationTypes) => {
  // create pdf blob url from OrderItemToPrint
  const blobPdf = await pdf(<OrderItemToPrint order={order} orientation={orientation} />);
  blobPdf.updateContainer(<OrderItemToPrint order={order} orientation={orientation} />);
  const result = await blobPdf.toBlob();
  const objectUrl = URL.createObjectURL(result);

  // open up browser print dialog for pdf printing directly on screen
  // by creating empty iframe in DOM with blob url as src
  let iframe = document.getElementById(iFrameId) as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = iFrameId;
    iframe.style.display = 'none';
    iframe.src = objectUrl;
  }
  iframe.onload = () => {
    setTimeout(() => {
      iframe.focus();
      iframe?.contentWindow?.print();
    }, 1);
  };
  document.body.appendChild(iframe);
};


type UsePrintOrder = {
  printOrder: Function;
  loading: boolean;
  error: ApolloError | undefined;
};

type UsePrintOrderHook = (orderId: string, orientation: PrintedItemOrientationTypes) => UsePrintOrder;

const usePrintOrderHook: UsePrintOrderHook = (orderId, orientation) => {
  /* State */
  const [iFrameId] = React.useState(shortid.generate());

  React.useEffect(() => {
    return () => {
      // remove iFrame from DOM
      const iFrame = document.getElementById(iFrameId);
      if (iFrame) {
       document.body.removeChild(iFrame);
      }
    }
  }, [iFrameId]);

  /* Hooks */
  const [breakApartOrder, { loading, error } ] = useMutation(BREAK_APART_ORDER, {
    variables: {
      orderId,
    },
    onCompleted(data) {
      printOrderItems(data?.breakApartOrder, iFrameId as string, orientation);
    },
    onError(error) {
      console.error(error);
    },
  });

  return {
    printOrder: breakApartOrder,
    loading: loading,
    error,
  };
};

export default usePrintOrderHook;
