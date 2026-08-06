## Restore “Light a Spark”

Reinstate the existing `Light a Spark` scholarship section on `/spark` exactly as it was before removal, without changing its content, styling, interactions, or any unrelated page sections.

### Changes
- Re-import the existing `SparkScholarship` component in `src/pages/Spark.tsx`.
- Render it in its original landing-page position: after `SparkPartners` and before `SparkCTA`.
- Preserve the existing donation link and Sponsor Your Orbit dialog behavior.

### Validation
- Confirm the landing page includes the scholarship section in the correct order.
- Confirm both scholarship actions remain available and the sponsor dialog still opens.
