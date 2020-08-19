create table appointments
(
    id                     int auto_increment
        primary key,
    client_name            varchar(255)               null,
    email                  varchar(250)               null,
    contact                varchar(20)                null,
    service_type           varchar(255)               not null,
    time_slot              varchar(255)               not null,
    booked_via             varchar(255)               null,
    unique_appointment_key varchar(250)               not null,
    arrival_time           varchar(255)               null,
    served_by              varchar(255)               null,
    created_on             varchar(250)               not null,
    status                 varchar(120) default 'new' not null
);

create table dealers
(
    id              int auto_increment
        primary key,
    dealership_name varchar(255) null,
    contact_person  varchar(255) null,
    contact_number  varchar(255) null,
    address         varchar(255) null,
    longitude       varchar(120) null,
    latitude        varchar(120) null
);

create table service_ids
(
    id             int auto_increment
        primary key,
    appointment_id int          null,
    service_name   varchar(255) null,
    created_on     varchar(255) null
);

create table users
(
    id         int auto_increment
        primary key,
    firstName  varchar(255)                not null,
    lastName   varchar(255)                not null,
    otherNames varchar(255)                null,
    userName   varchar(255)                null,
    email      varchar(255)                not null,
    password   varchar(255)                not null,
    userType   varchar(200) default 'user' not null
);

create table vehicles
(
    id                      int auto_increment
        primary key,
    dealership_id           int                                 not null,
    chasis_number           varchar(255)                        not null,
    brand                   varchar(250)                        not null,
    make                    varchar(255)                        null,
    model                   varchar(250)                        null,
    year                    varchar(120)                        null,
    vehicle_type            varchar(250)                        not null,
    vehicle_url             varchar(300)                        null,
    created_on              varchar(255)                        null,
    pre_registration_status varchar(100) default 'unregistered' null,
    inspection_status       varchar(100) default 'un_inspected' null,
    inspected_by            varchar(255)                        null,
    inspected_on            varchar(255)                        null
);


