# Mindisle Workflow: Test Memory & Knowledge

Use this workflow to test character episodic memory, knowledge confidence levels, and strict privacy isolation.

## Test Checklist

1. **Memory Grounding**:
   - Execute an event (e.g. Naufal discovers the stone well).
   - Assert: Memory records actual timestamp, tile coordinates, and event ID.

2. **Privacy Isolation**:
   - Seed private reflection in Naufal's memory subcollection.
   - Assert: Lauren's retrieval service returns zero results for Naufal's memory ID.

3. **Knowledge Transfer Mechanics (Scenario G)**:
   - Have Naufal build a bench while Lauren stands within 3 tiles.
   - Assert: Lauren acquires observation-based belief about the bench, but has zero access to Naufal's private thoughts.

4. **Epistemic Confidence Differentiation**:
   - Assert: Directly observed facts have confidence $\ge 0.9$.
   - Assert: Hearsay from conversation has confidence $0.5 \le c < 0.9$.
   - Assert: Inferences have confidence $< 0.5$.

