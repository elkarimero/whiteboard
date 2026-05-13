## ADDED Requirements

### Requirement: User can zoom in on the canvas with the scroll wheel
The system SHALL increase the zoom level when the user scrolls up on the canvas.

#### Scenario: Scroll up zooms in
- **WHEN** the user scrolls up on the canvas
- **THEN** the canvas zoom level increases
- **AND** the content appears larger on screen

### Requirement: User can zoom out on the canvas with the scroll wheel
The system SHALL decrease the zoom level when the user scrolls down on the canvas.

#### Scenario: Scroll down zooms out
- **WHEN** the user scrolls down on the canvas
- **THEN** the canvas zoom level decreases
- **AND** the content appears smaller on screen

### Requirement: Zoom is bounded between 30% and 300%
The system SHALL prevent the zoom level from going below 30% or above 300%.

#### Scenario: Zoom cannot go below 30%
- **WHEN** the canvas is at 30% zoom
- **AND** the user scrolls down
- **THEN** the zoom level stays at 30%

#### Scenario: Zoom cannot go above 300%
- **WHEN** the canvas is at 300% zoom
- **AND** the user scrolls up
- **THEN** the zoom level stays at 300%

### Requirement: Zoom is centered on the mouse cursor position
The system SHALL keep the canvas point under the mouse cursor fixed during a zoom operation.

#### Scenario: The point under the cursor does not move during zoom
- **WHEN** the user scrolls while the mouse is over a sticky note
- **THEN** the sticky note remains under the mouse cursor after the zoom

### Requirement: Note creation is accurate at any zoom level
The system SHALL place a new sticky note at the correct canvas position when the user double-clicks, regardless of the current zoom level.

#### Scenario: Double-click creates a note at the correct position when zoomed in
- **WHEN** the canvas is zoomed in
- **AND** the user double-clicks on the canvas
- **THEN** a new sticky note appears at the position of the double-click

#### Scenario: Double-click creates a note at the correct position when zoomed out
- **WHEN** the canvas is zoomed out
- **AND** the user double-clicks on the canvas
- **THEN** a new sticky note appears at the position of the double-click

### Requirement: Note dragging is accurate at any zoom level
The system SHALL move a sticky note to the correct canvas position when dragged, regardless of the current zoom level.

#### Scenario: Dragging a note is accurate when zoomed in
- **WHEN** the canvas is zoomed in
- **AND** the user drags a sticky note
- **THEN** the note follows the mouse cursor precisely during the drag
