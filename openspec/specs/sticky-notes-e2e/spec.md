## ADDED Requirements

### Requirement: Note creation is verifiable in the browser
The test SHALL verify that a double-click on the canvas creates a sticky note visible in the DOM.

#### Scenario: Double-clicking on the canvas creates a note
- **WHEN** the test performs a double-click on the canvas
- **THEN** the count of elements with `data-testid="sticky-note"` goes from 0 to 1
- **AND** the note is visible on screen

### Requirement: Note selection is verifiable in the browser
The test SHALL verify that clicking a note sets its `data-selected` attribute to `true`.

#### Scenario: Clicking on a note selects it
- **WHEN** the test clicks on a sticky note
- **THEN** the note has attribute `data-selected="true"`

### Requirement: Edit mode is verifiable in the browser
The test SHALL verify that double-clicking a note sets `contenteditable="true"` on its text zone.

#### Scenario: Double-clicking on a note enters edit mode
- **WHEN** the test double-clicks on an existing sticky note
- **THEN** the element with `data-testid="note-text"` has attribute `contenteditable="true"`

### Requirement: Text update and exit from edit mode are verifiable in the browser
The test SHALL verify that text typed in edit mode is saved and `contenteditable` is set back to `false` on blur.

#### Scenario: Typing in edit mode updates the note content
- **WHEN** the test types text while the note is in edit mode
- **AND** the test clicks outside the note
- **THEN** the note text contains the typed content
- **AND** `contenteditable` is `false`

### Requirement: Deletion via Delete key is verifiable in the browser
The test SHALL verify that pressing the Delete key removes a selected note from the DOM.

#### Scenario: Pressing Delete removes the selected note
- **WHEN** a note is selected
- **AND** the test presses the Delete key
- **THEN** the count of elements with `data-testid="sticky-note"` is 0

### Requirement: Deletion via × button is verifiable in the browser
The test SHALL verify that clicking the delete button removes the note from the DOM.

#### Scenario: Clicking the delete button removes the note
- **WHEN** the test clicks the element with `data-testid="delete-btn"`
- **THEN** the count of elements with `data-testid="sticky-note"` is 0

### Requirement: Drag and drop is verifiable in the browser
The test SHALL verify that dragging a note changes its position on screen.

#### Scenario: Dragging a note moves it to a new position
- **WHEN** the test drags the note to a different position on the canvas
- **THEN** the bounding box of the note differs from its initial position
