1. User Table

| Column Name  |            Type | Description     |
| ------------ | --------------: | --------------- |
| phone_number |     varchar(20) | Phone number    |
| logo         |    varchar(255) | Logo path/image |
| parent_id    | bigint nullable | Parent user ID  |
| created_at   |       timestamp | Created date    |
| updated_at   |       timestamp | Updated date    |


2. Agency Data Table

| Column Name         |                  Type | Description            |
| ------------------- | --------------------: | ---------------------- |
| id                  |                bigint | Primary key            |
| user_id             |                bigint | Foreign key → users.id |
| agency_name         |          varchar(255) | Agency name            |
| legal_name          |          varchar(255) | Legal company name     |
| email               |          varchar(255) | Agency email           |
| phone_number        |           varchar(20) | Primary phone          |
| alternate_phone     |  varchar(20) nullable | Alternate phone        |
| country             |          varchar(100) | Country                |
| state               |          varchar(100) | State                  |
| city                |          varchar(100) | City                   |
| postal_code         |           varchar(20) | Postal code            |
| address             |                  text | Address                |
| registration_number | varchar(255) nullable | Registration no        |
| gst_number          | varchar(255) nullable | GST number             |
| pan_number          | varchar(255) nullable | PAN number             |
| account_number      | varchar(255) nullable | Bank account           |
| ifsc_code           |  varchar(50) nullable | IFSC code              |
| note                |         text nullable | Note                   |
| tax_status          |          enum/tinyint | Tax status             |
| created_at          |             timestamp | Created date           |
| updated_at          |             timestamp | Updated date           |


3. Agency Documents Table
| Column Name        |            Type | Description               |
| ------------------ | --------------: | ------------------------- |
| id                 |          bigint | Primary key               |
| agency_id          |          bigint | Foreign key → agencies.id |
| document_name      |    varchar(255) | Document name             |
| document_type      |    varchar(100) | Type of document          |
| document_master_id | bigint nullable | Reference document ID     |
| upload_status      |         tinyint | Upload status (0/1)       |
| created_at         |       timestamp | Created date              |
| updated_at         |       timestamp | Updated date              |


4. Documents Table

| Column Name        |         Type | Description                       |
| ------------------ | -----------: | --------------------------------- |
| id                 |       bigint | Primary key                       |
| agency_document_id |       bigint | Foreign key → agency_documents.id |
| document_name      | varchar(255) | File name                         |
| path               |         text | File path                         |
| size               |  varchar(50) | File size                         |
| created_at         |    timestamp | Created date                      |
| updated_at         |    timestamp | Updated date                      |


users
   │
   └── agencies
          │
          └── agency_documents
                    │
                    └── documents

User (Hari)
 └── Agency (Cloud Travels)
        ├── GST Document
        │      ├── gst1.pdf
        │      └── gst2.pdf
        └── PAN Document
               └── pan.pdf

api user 
controller 
service 


inercian use only for page render other wise 
but for data store and  other think use  use only api but  render for this 
