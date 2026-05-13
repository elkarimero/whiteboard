## ADDED Requirements

### Requirement: Note creation is verifiable in the browser
The test SHALL verify that a double-click on the canvas creates a sticky note visible in the DOM.

#### Scenario: Double-clicking on the canvas creates a note
- **WHEN** the test performs a double-click at the center of the canvas 
- **THEN** the count of elements matching `.note` goes from 0 to 1
- **AND** the note is visible on screen 
