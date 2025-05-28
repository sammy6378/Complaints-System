
<!-- stack -->
# Stack

- NestJS
- NodeJS
- Typescript
- PostgresSQL


# Functionalities

## Admin Module Features Summary:

- Category Management : Admin can create, edit, and delete complaint categories.

- Subcategory Management : Admin can create, edit, and delete complaint subcategories.
- State Management : Admin can create, edit, and delete states associated with complaints.
- Complaint Management : Admin can view complaints, update remarks, and manage their status (open/closed).
- User Management : Admin can manage user information (view, edit, delete).
- User Logs : Admin can view user login/logout history and activities.
- Admin Logs : Admin can view their own login/logout history.
- Change Password : Admin can update their own password.



## User (Patient/Customer) Module Features Summary:
- User Registration : Users can register in the system.

- Forgot Password : Users can recover their password if forgotten.
- Lodge Complaint : Users can lodge a complaint, specifying the category, subcategory, and state.
- Complaint History : Users can view their previously lodged complaints and their status.
- Profile Management : Users can manage their personal profile (update details, change password).
- Change Password : Users can change their own password.



## Suggestions for Enhancements:

- SMS and Email Notifications : Notify users when their complaints are updated, resolved, or require further action.

- Complaint Escalation : Implement a feature where users can escalate complaints if not resolved in a given time frame.
- Feedback Mechanism : Allow users to provide feedback on how well their complaints were handled.
- Priority Levels for Complaints : Add priority levels to complaints (e.g., Low, Medium, High) to ensure more urgent issues are handled first.
- Analytics Dashboard : Provide admins with analytical tools to track complaints by category, status, user, or department.





# Relationships

### 🧩 **Entities and Relationships with Cardinalities**

#### 1. **Admins**

* **Primary Key**: `admin_id`
* **Relationships**:

  * One admin can have **many admin logs**.
  * (1) Admin → (0..\*) Admin Logs

#### 2. **Users**

* **Primary Key**: `user_id`
* **Relationships**:

  * One user can lodge **many complaints**.
  * One user can have **many user logs**.
  * (1) User → (0..\*) Complaints
  * (1) User → (0..\*) User Logs

#### 3. **Complaints**

* **Primary Key**: `complaint_id`
* **Relationships**:

  * Each complaint belongs to **one user**.
  * Each complaint belongs to **one category** and **one subcategory**.
  * Each complaint is associated with **one state**.
  * (1) Complaint → (1) User
  * (1) Complaint → (1) Category
  * (1) Complaint → (1) Subcategory
  * (1) Complaint → (1) State

#### 4. **Categories**

* **Primary Key**: `category_id`
* **Relationships**:

  * One category can have **many subcategories**.
  * One category can be referenced by **many complaints**.
  * (1) Category → (0..\*) Subcategories
  * (1) Category → (0..\*) Complaints

#### 5. **Subcategories**

* **Primary Key**: `subcategory_id`
* **Relationships**:

  * Each subcategory belongs to **one category**.
  * One subcategory can be referenced by **many complaints**.
  * (1) Subcategory → (1) Category
  * (1) Subcategory → (0..\*) Complaints

#### 6. **States**

* **Primary Key**: `state_id`
* **Relationships**:

  * One state can be associated with **many complaints**.
  * (1) State → (0..\*) Complaints

#### 7. **User Logs**

* **Primary Key**: `log_id`
* **Relationships**:

  * Each log belongs to **one user**.
  * (1) User Log → (1) User

#### 8. **Admin Logs**

* **Primary Key**: `log_id`
* **Relationships**:

  * Each log belongs to **one admin**.
  * (1) Admin Log → (1) Admin

---

### ✅ Summary of Cardinalities

| Entity      | Related Entity | Cardinality |
| ----------- | -------------- | ----------- |
| Admin       | Admin Logs     | 1 to Many   |
| User        | Complaints     | 1 to Many   |
| User        | User Logs      | 1 to Many   |
| Complaint   | Category       | Many to 1   |
| Complaint   | Subcategory    | Many to 1   |
| Complaint   | State          | Many to 1   |
| Category    | Subcategories  | 1 to Many   |
| Subcategory | Category       | Many to 1   |
| Category    | Complaints     | 1 to Many   |
| Subcategory | Complaints     | 1 to Many   |
| State       | Complaints     | 1 to Many   |

---

