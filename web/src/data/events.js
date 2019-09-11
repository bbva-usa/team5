import React from 'react';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { ActivityItem, Icon, Link, mergeStyleSets } from 'office-ui-fabric-react';
import { TestImages } from '@uifabric/example-data';


const iconClass = mergeStyles({
    fontSize: 50,
    height: 50,
    width: 50,
    margin: '0 25px'
});

const classNames = mergeStyleSets({
    exampleRoot: {
        marginTop: '20px'
    },
    nameText: {
        fontWeight: 'bold'
    }
});

const batchCheckIn = (name, stop, when) => ({
    key: 4,
    activityDescription: [
        <Link key={1} className={classNames.nameText}> {name} </Link>,
        <span key={2}> and </span>,
        <Link key={3} className={classNames.nameText}>
            5 others
        </Link>,
        <span key={4}> checked in to bus at </span>,
        <Link key={5} className={classNames.nameText}>
            {stop}
        </Link>,
    ],
    activityPersonas: [
        { imageInitials: 'JC', text: 'Jin Cheng' },
        { imageUrl: TestImages.personaMale },
        { imageInitials: 'AL', text: 'Annie Lindqvist' },
        { imageUrl: TestImages.personaFemale },
        { imageUrl: TestImages.personaMale },
        { imageUrl: TestImages.personaMale }
    ],
    timeStamp: when
})

const arrived = (name, stop, when) => ({
    key: 2,
    activityDescription: [
        <Link key={1} className={classNames.nameText}> {name} </Link>,
        <span key={2}> arrived </span>,
        <span key={3} className={classNames.nameText}>
            at {stop}
      </span>
    ],
    activityIcon: <Icon iconName={'Message'} />,
    timeStamp: when
})

export {
    arrived,
    batchCheckIn
}