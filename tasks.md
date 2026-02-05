# Spoolman NFC Integration Tasks

## Phase 1: Foundation & Setup
- [ ] **Initialize React project with Vite, TypeScript, and Tailwind CSS**
  - Set up the project structure.
  - Install necessary dependencies (including `lucide-react` for icons, `clsx`/`tailwind-merge` for styling).
  - Configure path aliases.
- [ ] **Set up Spoolman API Client**
  - Create a typed API client to interact with the Spoolman backend.
  - Implement endpoints for fetching spools, filaments, and vendors.
  - specific focus on `GET /api/v1/spool` and `GET /api/v1/spool/{id}`.
- [ ] **Implement OpenSpool Data Structures & Validation**
  - Define TypeScript interfaces matching the OpenSpool JSON specification.
  - Implement validation logic (e.g., using `zod`) to ensure data integrity before writing to tags.

## Phase 2: Core Logic
- [ ] **Create NFC Abstraction Layer (Web NFC)**
  - Implement the service to interact with the `NDEFReader` API.
  - Handle permission requests and reading/writing NDEF records.
  - **Constraint:** Targeted for Chrome on Android.
- [ ] **Implement Spoolman <-> OpenSpool Mapper**
  - Create utility functions to convert Spoolman API response data into the OpenSpool JSON format.
  - Include the Spoolman `id` as `spool_id` in the OpenSpool data.
  - Handle missing data or format discrepancies.

## Phase 3: User Interface
- [ ] **Add Settings/Configuration Page**
  - Create a simple settings page to input the Spoolman instance URL.
  - Persist this URL in `localStorage`.
- [ ] **Build Main Dashboard UI**
  - Create a responsive layout.
  - Display a list of recent spools from Spoolman.
  - Add search/filter capabilities.
- [ ] **Build "Write to Tag" UI Flow**
  - Select a spool from the list.
  - Preview the OpenSpool JSON data.
  - "Ready to Scan" overlay to write data to the NFC tag.
- [ ] **Build "Read from Tag" UI Flow**
  - "Scan Tag" button/mode.
  - Display parsed OpenSpool data from the tag.
  - Option to find the corresponding spool in the local Spoolman instance (if it exists).
