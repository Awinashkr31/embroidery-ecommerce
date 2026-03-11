# Performance Optimization Rationale: Parallelizing Setting Fetches

## Issue
In several React components (`CustomDesign.jsx`, `About.jsx`, `MehndiBooking.jsx`, `Gallery.jsx`), multiple independent database queries are executed sequentially within `useEffect` hooks.

## Inefficiency
The use of sequential `await` calls for `fetchSetting` creates a network request waterfall. Each request must wait for the previous one to resolve before starting, even though they do not depend on each other's results.

## Theoretical Baseline vs. Optimization
- **Sequential Execution (Current):** Total Time = $T_{req1} + T_{req2} + T_{req3} + ... + T_{reqN}$
- **Parallel Execution (Optimized):** Total Time = $\max(T_{req1}, T_{req2}, T_{req3}, ..., T_{reqN}) + \text{Overhead}$

In a typical web environment with network latency, this change can reduce the data loading time by roughly $(N-1) \times \text{Latency}$, where $N$ is the number of settings being fetched. For `CustomDesign.jsx`, where $N=4$, the improvement is approximately $3 \times \text{Latency}$.

## Practical Measurement
Since direct measurement of Supabase network latency in this environment is impractical, we rely on the proven efficiency of `Promise.all()` for concurrent I/O operations in Node.js/Browser environments.
