## ADDED Requirements

### Requirement: User can create a sticky note
The system SHALL create a new sticky note when the user double-clicks on the canvas.

#### Scenario: Create a note by double-clicking
- **WHEN** the user double-clicks on the canvas
- **THEN** a new empty sticky note appears at the click position

### Requirement: User can delete a sticky note
The system SHALL delete selected sticky notes when the user presses suppression key on the keyboard

#### Scenario: Select a sticky note
- **WHEN** the user clicks on a sticky note
- **THEN** the sticky note is marked as selected
- **AND** a visual indicator appears on the note (e.g. highlighted border)

#### Scenario: Delete a selected sticky note
- **WHEN** a sticky note is selected
- **AND** the user presses the Suppr key
- **THEN** the note is deleted from the whiteboard

### Requirement: User can drag and drop a sticky everywhere on the whiteboard
The system SHALL give ability to drag and drop sticky note everywhere in the whiteboard

#### Scenario: Drag and drop a sticky note
- **WHEN** the user maintain the click on a sticky note he can drag it on the whiteboard
- **AND** when the user release the click  
- **THEN** the sticky is drop and stay at the position of the mouse 

### Requirement: User can edit content to a sticky note
The system SHALL edit the text displayed in a sticky note when the user enter edit mode and type text on the keyboard 

#### Scenario: Enter edit mode on a sticky note
- **WHEN** the user double-clicks on an existing sticky note
- **THEN** the sticky note enters edit mode with a text cursor visible

#### Scenario: Update content while in edit mode
- **WHEN** the user is in edit mode
- **AND** types text on the keyboard
- **THEN** the text appears in the sticky note

#### Scenario: Exit edit mode
- **WHEN** the user clicks outside the note
- **THEN** edit mode closes and the entered text is saved