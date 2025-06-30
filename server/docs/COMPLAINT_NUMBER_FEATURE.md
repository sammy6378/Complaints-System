# Complaint Number Feature

## Overview
Added a unique complaint number feature that generates sequential numbers for each complaint (e.g., #2340).

## Changes Made

### 1. Entity Changes (`complaint.entity.ts`)
- Added `complaint_number` field with auto-increment functionality
- Uses `@Generated('increment')` decorator for automatic sequential numbering
- Field is marked as `unique` to ensure no duplicates

```typescript
@Column({ unique: true })
@Generated('increment')
complaint_number: number;
```

### 2. Service Changes (`complaints.service.ts`)
- Updated create method to return complaint number in success message
- Added `findByComplaintNumber()` method to find complaints by their number
- Updated all find methods to order by complaint number (newest first)
- Enhanced response messages to include complaint numbers

### 3. Controller Changes (`complaints.controller.ts`)
- Added new endpoint: `GET /complaints/number/:number`
- Includes API documentation with Swagger decorators
- Allows frontend to search complaints by their unique number

## Usage Examples

### Creating a Complaint
```bash
POST /complaints
# Response: "Complaint #2340 created successfully"
```

### Finding by Complaint Number
```bash
GET /complaints/number/2340
# Returns the specific complaint with number 2340
```

### Frontend Display
You can now display complaints as:
- "Complaint #2340 has been created"
- "Complaint #2340 updated successfully"
- "Viewing Complaint #2340"

## Database Migration
⚠️ **Important**: After making these changes, you need to:

1. If using TypeORM migrations:
   ```bash
   npm run typeorm:generate-migration -- AddComplaintNumber
   npm run typeorm:run-migrations
   ```

2. If using synchronization (development only):
   - The `complaint_number` field will be automatically added
   - Existing complaints will get sequential numbers starting from 1

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/complaints` | Create complaint (returns with complaint number) |
| GET | `/complaints/number/:number` | Find complaint by complaint number |
| GET | `/complaints` | List all complaints (ordered by number) |
| GET | `/complaints/qry` | Filter complaints (ordered by number) |

## Benefits
- Unique, human-readable identifiers for complaints
- Easy reference for customer service
- Sequential numbering for better organization
- Frontend-friendly display format
