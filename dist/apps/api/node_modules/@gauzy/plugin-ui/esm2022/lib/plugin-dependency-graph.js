// ─── Validation ─────────────────────────────────────────────────────────────
/**
 * Validates a flat list of plugin definitions for dependency issues.
 *
 * Checks for:
 * - **Missing dependencies**: `dependsOn` references a plugin ID not in the list
 * - **Circular dependencies**: A → B → C → A creates a cycle
 * - **Self-dependencies**: Plugin depends on itself
 * - **Duplicate IDs**: Multiple plugins share the same ID
 * - **Orphan plugins**: Plugins that no other plugin depends on and depend on nothing (info-level)
 *
 * @example
 * ```ts
 * import { validatePluginDependencies, flattenPlugins } from '@gauzy/plugin-ui';
 *
 * const allPlugins = flattenPlugins(config.plugins);
 * const result = validatePluginDependencies(allPlugins);
 *
 * if (!result.valid) {
 *   for (const issue of result.errors) {
 *     console.error(`[${issue.pluginId}] ${issue.message}`);
 *   }
 * }
 *
 * // Topological order for safe initialization
 * console.log('Boot order:', result.topologicalOrder);
 * ```
 *
 * @param plugins Flat list of plugin definitions (use `flattenPlugins()` first).
 * @returns Validation result with issues and topological ordering.
 */
export function validatePluginDependencies(plugins) {
    const issues = [];
    const idSet = new Set();
    const byId = new Map();
    // ── Check duplicate IDs ──
    for (const p of plugins) {
        if (idSet.has(p.id)) {
            issues.push({
                pluginId: p.id,
                severity: 'error',
                message: `Duplicate plugin ID '${p.id}'. Each plugin must have a unique identifier.`,
                category: 'duplicate-id'
            });
        }
        idSet.add(p.id);
        byId.set(p.id, p);
    }
    // ── Check self-dependencies and missing dependencies ──
    for (const p of plugins) {
        if (!p.dependsOn?.length)
            continue;
        for (const depId of p.dependsOn) {
            if (depId === p.id) {
                issues.push({
                    pluginId: p.id,
                    severity: 'error',
                    message: `Plugin '${p.id}' depends on itself.`,
                    category: 'self-dep'
                });
            }
            else if (!idSet.has(depId)) {
                issues.push({
                    pluginId: p.id,
                    severity: 'error',
                    message: `Plugin '${p.id}' depends on '${depId}', which is not registered.`,
                    category: 'missing-dep'
                });
            }
        }
    }
    // ── Detect cycles (Kahn's algorithm) ──
    const inDegree = new Map();
    const adjacency = new Map();
    for (const p of plugins) {
        if (!inDegree.has(p.id))
            inDegree.set(p.id, 0);
        if (!adjacency.has(p.id))
            adjacency.set(p.id, []);
        for (const depId of p.dependsOn ?? []) {
            if (!idSet.has(depId) || depId === p.id)
                continue;
            // depId → p.id (depId must come before p.id)
            const adj = adjacency.get(depId) ?? [];
            adj.push(p.id);
            adjacency.set(depId, adj);
            inDegree.set(p.id, (inDegree.get(p.id) ?? 0) + 1);
        }
    }
    const queue = [];
    const topologicalOrder = [];
    for (const [id, deg] of inDegree) {
        if (deg === 0)
            queue.push(id);
    }
    while (queue.length > 0) {
        const current = queue.shift();
        topologicalOrder.push(current);
        for (const neighbor of adjacency.get(current) ?? []) {
            const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
            inDegree.set(neighbor, newDeg);
            if (newDeg === 0)
                queue.push(neighbor);
        }
    }
    // Plugins not in topological order are part of a cycle
    const inTopOrder = new Set(topologicalOrder);
    const cyclePlugins = plugins.filter((p) => !inTopOrder.has(p.id));
    if (cyclePlugins.length > 0) {
        // Find the cycle participants
        const cycleIds = cyclePlugins.map((p) => p.id);
        issues.push({
            pluginId: cycleIds[0],
            severity: 'error',
            message: `Circular dependency detected involving: ${cycleIds.join(' → ')}. Break the cycle by removing a dependsOn entry.`,
            category: 'cycle'
        });
    }
    // ── Check orphan plugins (info-level) ──
    const depTargets = new Set();
    const depSources = new Set();
    for (const p of plugins) {
        if (p.dependsOn?.length) {
            depSources.add(p.id);
            for (const d of p.dependsOn)
                depTargets.add(d);
        }
    }
    for (const p of plugins) {
        if (!depTargets.has(p.id) && !depSources.has(p.id) && plugins.length > 1) {
            issues.push({
                pluginId: p.id,
                severity: 'info',
                message: `Plugin '${p.id}' is standalone — no dependencies and nothing depends on it.`,
                category: 'orphan'
            });
        }
    }
    // ── Calculate depths ──
    const depths = new Map();
    for (const id of topologicalOrder) {
        const p = byId.get(id);
        let maxDepth = 0;
        for (const depId of p?.dependsOn ?? []) {
            const depDepth = depths.get(depId) ?? 0;
            maxDepth = Math.max(maxDepth, depDepth + 1);
        }
        depths.set(id, maxDepth);
    }
    return {
        valid: issues.filter((i) => i.severity === 'error').length === 0,
        issues,
        errors: issues.filter((i) => i.severity === 'error'),
        warnings: issues.filter((i) => i.severity === 'warning'),
        topologicalOrder,
        depths
    };
}
/**
 * Logs validation results to the console with appropriate log levels.
 *
 * @param result The validation result from `validatePluginDependencies()`.
 */
export function logDependencyValidation(result) {
    if (result.valid && result.issues.length === 0) {
        console.log('[PluginDependencyGraph] All plugin dependencies are valid.');
        return;
    }
    console.group('[PluginDependencyGraph] Validation Results');
    for (const issue of result.issues) {
        const prefix = `[${issue.pluginId}]`;
        switch (issue.severity) {
            case 'error':
                console.error(`${prefix} ${issue.message}`);
                break;
            case 'warning':
                console.warn(`${prefix} ${issue.message}`);
                break;
            case 'info':
                console.info(`${prefix} ${issue.message}`);
                break;
        }
    }
    if (result.topologicalOrder.length > 0) {
        console.log('Boot order:', result.topologicalOrder.join(' → '));
    }
    console.groupEnd();
}
//# sourceMappingURL=plugin-dependency-graph.js.map