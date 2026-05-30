| **Users Table** |                                           |
| --------------- | ----------------------------------------- |
| **Column Name** | **Type / Notes**                          |
| id              | Primary Key                               |
| name            | String                                    |
| email           | String (Unique)                           |
| password        | String                                    |
| profile_pic     | String / Nullable                         |
| type            | `superadmin`, `staff`, `agency`, `client` |
| parent_id       | Foreign Key → users.id (nullable)         |
| created_at      | Timestamp                                 |
| updated_at      | Timestamp                                 |



| **Agencies Table** |                        |
| ------------------ | ---------------------- |
| **Column Name**    | **Type / Notes**       |
| id                 | Primary Key            |
| user_id            | Foreign Key → users.id |
| logo               | String / Nullable      |
| tax_active         | Boolean                |
| country            | String                 |
| state              | String                 |
| address            | Text                   |
| pin_code           | String                 |
| created_at         | Timestamp              |
| updated_at         | Timestamp              |



| **Agency Documents Table** |                        |
| -------------------------- | ---------------------- |
| **Column Name**            | **Type / Notes**       |
| id                         | Primary Key            |
| user_id                    | Foreign Key → users.id |
| document_name              | String                 |
| type                       | String                 |
| image_path                 | String                 |
| created_at                 | Timestamp              |
| updated_at                 | Timestamp              |



| **Agency Services Table** |                        |
| ------------------------- | ---------------------- |
| **Column Name**           | **Type / Notes**       |
| id                        | Primary Key            |
| user_id                   | Foreign Key → users.id |
| service_name              | String                 |
| created_at                | Timestamp              |
| updated_at                | Timestamp              |


| **Agency Balance Table** |                        |
| ------------------------ | ---------------------- |
| **Column Name**          | **Type / Notes**       |
| id                       | Primary Key            |
| user_id                  | Foreign Key → users.id |
| amount                   | Decimal(10,2)          |
| price                    | Decimal(10,2)          |
| created_at               | Timestamp              |
| updated_at               | Timestamp              |



| **Roles Table (Spatie)** |                  |
| ------------------------ | ---------------- |
| **Column Name**          | **Type / Notes** |
| id                       | Primary Key      |
| name                     | String           |
| guard_name               | String           |
| created_at               | Timestamp        |
| updated_at               | Timestamp        |



| **Permissions Table (Spatie)** |                  |
| ------------------------------ | ---------------- |
| **Column Name**                | **Type / Notes** |
| id                             | Primary Key      |
| name                           | String           |
| guard_name                     | String           |
| created_at                     | Timestamp        |
| updated_at                     | Timestamp        |


| **Model Has Roles Table** |                        |
| ------------------------- | ---------------------- |
| **Column Name**           | **Type / Notes**       |
| role_id                   | Foreign Key → roles.id |
| model_type                | Morph Type             |
| model_id                  | User ID                |


| **Role Has Permissions Table** |                              |
| ------------------------------ | ---------------------------- |
| **Column Name**                | **Type / Notes**             |
| permission_id                  | Foreign Key → permissions.id |
| role_id                        | Foreign Key → roles.id       |


| **Staff Table** |                                  |
| --------------- | -------------------------------- |
| **Column Name** | **Type / Notes**                 |
| id              | Primary Key                      |
| user_id         | Foreign Key → users.id           |
| staff_id        | Auto Generated Staff ID          |
| first_name      | String                           |
| last_name       | String                           |
| email           | String                           |
| phone           | String                           |
| designation     | String                           |
| department      | String                           |
| joining_date    | Date                             |
| dob             | Date                             |
| gender          | Enum (`male`, `female`, `other`) |
| status          | Enum (`active`, `inactive`)      |
| profile_pic     | String / Nullable                |
| created_at      | Timestamp                        |
| updated_at      | Timestamp                        |


| **Staff Address Table** |                        |
| ----------------------- | ---------------------- |
| **Column Name**         | **Type / Notes**       |
| id                      | Primary Key            |
| staff_id                | Foreign Key → staff.id |
| country                 | String                 |
| state                   | String                 |
| city                    | String                 |
| address                 | Text                   |
| pin_code                | String                 |
| created_at              | Timestamp              |
| updated_at              | Timestamp              |



| **Staff Attendance Table** |                                                |
| -------------------------- | ---------------------------------------------- |
| **Column Name**            | **Type / Notes**                               |
| id                         | Primary Key                                    |
| staff_id                   | Foreign Key → staff.id                         |
| attendance_date            | Date                                           |
| check_in                   | Time                                           |
| check_out                  | Time                                           |
| total_hours                | String                                         |
| status                     | Enum (`present`, `absent`, `late`, `half_day`) |
| note                       | Text / Nullable                                |
| created_at                 | Timestamp                                      |
| updated_at                 | Timestamp                                      |



| **Staff Leave Table** |                                             |
| --------------------- | ------------------------------------------- |
| **Column Name**       | **Type / Notes**                            |
| id                    | Primary Key                                 |
| staff_id              | Foreign Key → staff.id                      |
| leave_type            | Enum (`sick`, `casual`, `annual`, `unpaid`) |
| from_date             | Date                                        |
| to_date               | Date                                        |
| total_days            | Integer                                     |
| reason                | Text                                        |
| status                | Enum (`pending`, `approved`, `rejected`)    |
| approved_by           | User ID                                     |
| created_at            | Timestamp                                   |
| updated_at            | Timestamp                                   |


| **Staff Documents Table** |                        |
| ------------------------- | ---------------------- |
| **Column Name**           | **Type / Notes**       |
| id                        | Primary Key            |
| staff_id                  | Foreign Key → staff.id |
| document_name             | String                 |
| document_type             | String                 |
| document_file             | String                 |
| expiry_date               | Date / Nullable        |
| created_at                | Timestamp              |
| updated_at                | Timestamp              |



| **Staff Wages Table** |                                      |
| --------------------- | ------------------------------------ |
| **Column Name**       | **Type / Notes**                     |
| id                    | Primary Key                          |
| staff_id              | Foreign Key → staff.id               |
| salary_type           | Enum (`hourly`, `monthly`, `weekly`) |
| basic_salary          | Decimal(10,2)                        |
| overtime_amount       | Decimal(10,2)                        |
| bonus                 | Decimal(10,2)                        |
| deduction             | Decimal(10,2)                        |
| net_salary            | Decimal(10,2)                        |
| payment_date          | Date                                 |
| created_at            | Timestamp                            |
| updated_at            | Timestamp                            |


| **Staff Extra Funds Table** |                        |
| --------------------------- | ---------------------- |
| **Column Name**             | **Type / Notes**       |
| id                          | Primary Key            |
| staff_id                    | Foreign Key → staff.id |
| fund_type                   | String                 |
| amount                      | Decimal(10,2)          |
| note                        | Text                   |
| added_by                    | User ID                |
| created_at                  | Timestamp              |
| updated_at                  | Timestamp              |


