import { UserProfile, SkillNode, ActivityEntry } from "../types";

export const TOIBA_SKILLS: SkillNode[] = [
  // SYSTEMS & LOW LEVEL
  {
    id: "ts-compiler-ast",
    label: "TypeScript AST Engine & Compiler Passes",
    shortCode: "SYS-01",
    domain: "systems",
    level: "expert",
    status: "verified",
    description: "Custom abstract syntax tree transformation passes, type-checker hooks, and zero-allocation token streaming for high-throughput transpilation.",
    xp: 850,
    masteryCount: 4,
    freshnessPercentage: 100,
    iconName: "Binary",
    x: 180,
    y: 120,
    prerequisites: [],
    lastAttestedAt: "2026-07-28T14:22:00Z",
    evidence: {
      type: "github_commit",
      title: "Add incremental AST visitor with scope resolution caching",
      repoUrl: "https://github.com/toibawani/ast-core",
      commitHash: "9f8a3c2e1184bc234a991823efca4421bca90821",
      branch: "main",
      timestamp: "2026-07-28T14:22:00Z",
      metrics: {
        throughput: "450k nodes/sec",
        latency: "1.2ms",
        testPassRate: "100% (48/48)",
        coverage: "98.4%",
      },
      diffContent: `@@ -42,18 +42,32 @@ export class ASTTransformationPass implements CompilerPass {
+  private readonly scopeCache = new Map<NodeId, ScopeContext>();
+
   public transform(rootNode: ASTNode, ctx: TransformContext): TransformedNode {
-    const tokens = this.tokenizer.tokenize(rootNode.raw);
-    return this.walkAndSubstitute(tokens);
+    // Pre-allocated single pass token visitor with zero heap reallocations
+    const scope = this.resolveScopeHierarchy(rootNode, ctx);
+    const visitor = new FastTokenVisitor(this.options.optimizationLevel);
+    
+    visitor.onIdentifier = (node, depth) => {
+      if (this.scopeCache.has(node.id)) {
+        return this.scopeCache.get(node.id)!.fastSubstitute(node);
+      }
+      const resolved = scope.lookupSymbol(node.lexeme);
+      this.scopeCache.set(node.id, resolved);
+      return resolved.transformed;
+    };
+
+    return visitor.execute(rootNode);
   }
 }`,
      terminalTrace: [
        { type: "cmd", text: "$ cargo test --release -p ts-ast-visitor" },
        { type: "info", text: "Compiling ts-ast-visitor v2.4.0 (/crates/ast)..." },
        { type: "stdout", text: "running 48 tests" },
        { type: "stdout", text: "test visitor::test_scope_resolution_caching ... ok (0.04ms)" },
        { type: "stdout", text: "test visitor::test_nested_block_closure_binding ... ok (0.08ms)" },
        { type: "stdout", text: "test parser::test_streaming_lex_10mb_source ... ok (1.12ms)" },
        { type: "stdout", text: "test compiler::test_wasm_emission_target ... ok (0.60ms)" },
        { type: "success", text: "test result: ok. 48 passed; 0 failed; 0 ignored; finished in 1.84ms" },
        { type: "info", text: "Benchmark [100,000 AST nodes]: 450,210 nodes/sec | Peak Memory: 3.2MB" },
      ],
      chaosScenarios: [
        {
          id: "chaos-ast-fuzz",
          title: "Fuzz 100,000 Corrupted TypeScript Tokens",
          description: "Injects malformed syntax tokens, deep cyclic closures, and unterminated template strings to test parser fault-tolerance.",
          command: "$ cargo run --bin ast-fuzzer -- --iterations 100000 --threads 8",
          expectedResult: "0 panics, 100% recovered with precise diagnostic line coordinates.",
          recoveryTimeMs: 42,
          terminalLogs: [
            { type: "cmd", text: "$ cargo run --bin ast-fuzzer -- --iterations 100000 --threads 8" },
            { type: "info", text: "Spawning 8 parallel libFuzzer workers against AST token stream..." },
            { type: "stdout", text: "[Worker 0] 12,500 malformed syntax permutations processed (0 panics)" },
            { type: "stdout", text: "[Worker 3] Deep recursion [depth=10,000] cleanly unwound via stack guard" },
            { type: "stdout", text: "[Worker 7] Unterminated Unicode surrogate pairs gracefully flagged" },
            { type: "success", text: "✔ 100,000 fuzz cases survived in 42ms with 0 memory leaks." },
          ],
        },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:ts-compiler-ast:1753712520",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-07-28T14:22:15Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "ts-compiler-ast",
        skillName: "TypeScript AST Engine & Compiler Passes",
        domain: "systems",
        level: "expert",
        score: 98.4,
        merkleRoot: "7f4c0a1b92e3847561928374a5b6c7d8e9f0123456789abcdef0123456789abc",
        evidenceFingerprint: "0x9f8a3c2e1184bc234a991823efca4421bca90821",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-07-28T14:22:15Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8559f8a3c2e1184bc23",
      },
    },
  },
  {
    id: "rust-wasm-allocator",
    label: "Zero-Copy Wasm Linear Memory Slab Allocator",
    shortCode: "SYS-02",
    domain: "systems",
    level: "master",
    status: "verified",
    description: "High-performance no_std memory allocator in Rust targeting WebAssembly with zero allocation overhead and deterministic cacheline alignment.",
    xp: 1200,
    masteryCount: 5,
    freshnessPercentage: 100,
    iconName: "Cpu",
    x: 360,
    y: 120,
    prerequisites: ["ts-compiler-ast"],
    lastAttestedAt: "2026-08-02T11:05:00Z",
    evidence: {
      type: "benchmark_suite",
      title: "SIMD-aligned linear slab pool for WASM interop",
      repoUrl: "https://github.com/toibawani/wasm-slab-alloc",
      commitHash: "e104f29a084bc9123891048a12903bce82910411",
      branch: "main",
      timestamp: "2026-08-02T11:05:00Z",
      metrics: {
        throughput: "1.82 GB/sec",
        latency: "0.04ms",
        testPassRate: "100% (32/32)",
        memoryUsage: "2.4 MB peak",
      },
      diffContent: `@@ -15,14 +15,28 @@ pub struct SlabPool<const SLAB_SIZE: usize> {
+#[repr(align(64))]
+pub struct CacheAlignedSlab {
+    data: [u8; 65536],
+    cursor: core::sync::atomic::AtomicUsize,
+}
+
+impl<const SLAB_SIZE: usize> SlabPool<SLAB_SIZE> {
+    #[inline(always)]
+    pub unsafe fn alloc_slice_zero_copy(&self, length: usize) -> Result<*mut u8, AllocError> {
+        let old_cursor = self.active_slab.cursor.fetch_add(length, Ordering::AcqRel);
+        if old_cursor + length > SLAB_SIZE {
+            return self.grow_secondary_arena(length);
+        }
+        Ok(self.active_slab.data.as_mut_ptr().add(old_cursor))
+    }
+}`,
      terminalTrace: [
        { type: "cmd", text: "$ wasm-pack test --node --release" },
        { type: "stdout", text: "Compiling wasm-slab-alloc for target wasm32-unknown-unknown..." },
        { type: "stdout", text: "Running Node.js test harness against WASM linear memory..." },
        { type: "stdout", text: "✔ test_slab_reallocation_under_concurrent_locks ... PASS (0.02ms)" },
        { type: "stdout", text: "✔ test_simd_128bit_boundary_stride ... PASS (0.01ms)" },
        { type: "stdout", text: "✔ test_zero_copy_js_typed_array_mutation ... PASS (0.03ms)" },
        { type: "success", text: "32/32 tests passed without leaks. Allocation rate: 1.82 GB/s" },
      ],
      chaosScenarios: [
        {
          id: "chaos-wasm-concurrency",
          title: "Simulate 10,000 Thread Lock-Free Allocations",
          description: "Stresses atomic cursor increments across 16 parallel Web Workers to test memory safety under contention.",
          command: "$ node test/stress_concurrency.mjs --workers 16 --ops 10000",
          expectedResult: "Zero memory fragmentation, 0 data races, 100% deterministic layout.",
          recoveryTimeMs: 14,
          terminalLogs: [
            { type: "cmd", text: "$ node test/stress_concurrency.mjs --workers 16 --ops 10000" },
            { type: "stdout", text: "Broadcasting SharedArrayBuffer to 16 Web Workers..." },
            { type: "stdout", text: "Executing 10,000 concurrent zero-copy slice allocations..." },
            { type: "stdout", text: "Peak throughput: 2,140,000 allocs/sec (Atomic CAS zero retries)" },
            { type: "success", text: "✔ Memory audit clean: 0 bytes leaked, 0 memory boundaries breached." },
          ],
        },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:rust-wasm-allocator:1754132700",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-08-02T11:05:22Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "rust-wasm-allocator",
        skillName: "Zero-Copy Wasm Linear Memory Slab Allocator",
        domain: "systems",
        level: "master",
        score: 99.2,
        merkleRoot: "3c84f291048bce9123849104a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9",
        evidenceFingerprint: "0xe104f29a084bc9123891048a12903bce82910411",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-08-02T11:05:22Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "b491a084bc9123891048a12903bce82910411e3b0c44298fc1c149afbf4c8996",
      },
    },
  },
  {
    id: "raft-consensus-engine",
    label: "Distributed Raft Consensus & Log Compaction",
    shortCode: "SYS-03",
    domain: "systems",
    level: "expert",
    status: "verified",
    description: "Production Raft implementation with dynamic cluster membership changes, log compaction, and sub-5ms split-brain recovery.",
    xp: 950,
    masteryCount: 3,
    freshnessPercentage: 100,
    iconName: "Layers",
    x: 540,
    y: 120,
    prerequisites: ["rust-wasm-allocator"],
    lastAttestedAt: "2026-08-06T09:40:00Z",
    evidence: {
      type: "pull_request",
      title: "feat(raft): implement asynchronous log compaction with zero read lock stalling",
      repoUrl: "https://github.com/toibawani/merit-raft",
      commitHash: "7b4c9a1029384812a0fbc9238471203948129384",
      branch: "feat/log-compaction",
      timestamp: "2026-08-06T09:40:00Z",
      metrics: {
        throughput: "120,000 tx/sec",
        p99Latency: "4.2ms",
        testPassRate: "100% (64/64)",
        coverage: "96.8%",
      },
      diffContent: `@@ -120,12 +120,24 @@ func (r *RaftNode) HandleAppendEntries(args *AppendEntriesArgs, reply *AppendEnt
+	// Non-blocking log compaction snapshot barrier
+	if args.Term < r.currentTerm {
+		reply.Success = false
+		reply.Term = r.currentTerm
+		return
+	}
+	r.electionTimer.Reset(r.randomTimeout())
+	if args.PrevLogIndex > r.lastLogIndex() {
+		reply.Success = false
+		reply.ConflictIndex = r.lastLogIndex() + 1
+		return
+	}
+	r.commitEntriesAsync(args.Entries, args.LeaderCommit)`,
      terminalTrace: [
        { type: "cmd", text: "$ go test -v -race -timeout 30s ./raft/..." },
        { type: "info", text: "Simulating 5-node cluster partition chaos suite..." },
        { type: "stdout", text: "=== RUN   TestRaftElectionPartitionAndHealing" },
        { type: "stdout", text: "    Leader elected in 18ms on Term 3" },
        { type: "stdout", text: "    Partitioning Node 1 & 2 (Minority isolate)" },
        { type: "stdout", text: "    Quorum sustained on Nodes 3,4,5. 10,000 tx written with 0 dropped." },
        { type: "stdout", text: "--- PASS: TestRaftElectionPartitionAndHealing (0.42s)" },
        { type: "success", text: "PASS: 64/64 tests passed with -race detection clean." },
      ],
      chaosScenarios: [
        {
          id: "chaos-raft-split-brain",
          title: "Inject 3-Node Split-Brain Partition",
          description: "Isolates active leader and tests minority drop, majority re-election, and state reconciliation upon partition healing.",
          command: "$ go test -v -run TestSplitBrainChaos ./raft/...",
          expectedResult: "Zero data loss. Quorum elected new leader in 18ms. Re-joined nodes caught up seamlessly.",
          recoveryTimeMs: 18,
          terminalLogs: [
            { type: "cmd", text: "$ go test -v -run TestSplitBrainChaos ./raft/..." },
            { type: "warn", text: "[CHAOS INJECTION] Network partition dropping all packets between [Node 1,2] and [Node 3,4,5]" },
            { type: "stdout", text: "[Node 3] Election timer triggered (150ms). Term incremented: 4" },
            { type: "stdout", text: "[Node 3] Received votes from Node 4, 5. Quorum confirmed. NEW LEADER elected." },
            { type: "stdout", text: "[HEALED] Network partition restored. Node 1, 2 synchronized via AppendEntries snapshot." },
            { type: "success", text: "✔ Quorum maintained across 50,000 continuous writes with 0 transaction loss." },
          ],
        },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:raft-consensus-engine:1754473200",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-08-06T09:40:12Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "raft-consensus-engine",
        skillName: "Distributed Raft Consensus & Log Compaction",
        domain: "systems",
        level: "expert",
        score: 97.6,
        merkleRoot: "9f8a3c2e1184bc234a991823efca4421bca908217f4c0a1b92e3847561928374",
        evidenceFingerprint: "0x7b4c9a1029384812a0fbc9238471203948129384",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-08-06T09:40:12Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "c8996fb92427ae41e4649b934ca495991b7852b8559f8a3c2e1184bc23e3b0c442",
      },
    },
  },
  {
    id: "ebpf-packet-filter",
    label: "eBPF Kernel Network Packet Filter & Flow Tracer",
    shortCode: "SYS-04",
    domain: "systems",
    level: "master",
    status: "verified",
    description: "Linux kernel XDP / TC eBPF programs for wire-speed L4 DDoS mitigation and kernel-space metric telemetry.",
    xp: 1400,
    masteryCount: 6,
    freshnessPercentage: 100,
    iconName: "Shield",
    x: 720,
    y: 120,
    prerequisites: ["raft-consensus-engine"],
    lastAttestedAt: "2026-08-10T16:15:00Z",
    evidence: {
      type: "live_demo",
      title: "XDP driver-mode wire-speed packet filter",
      repoUrl: "https://github.com/toibawani/ebpf-xdp-guard",
      commitHash: "4f8a12903847291048bce9123849104a8b7c6d5e",
      branch: "main",
      timestamp: "2026-08-10T16:15:00Z",
      metrics: {
        throughput: "14.2 Mpps",
        latency: "12ns",
        testPassRate: "100%",
        coverage: "99.1%",
      },
      diffContent: `SEC("xdp")
int xdp_flow_filter(struct xdp_md *ctx) {
    void *data = (void *)(long)ctx->data;
    void *data_end = (void *)(long)ctx->data_end;
    
    struct ethhdr *eth = data;
    if ((void *)(eth + 1) > data_end) return XDP_PASS;
    if (eth->h_proto != bpf_htons(ETH_P_IP)) return XDP_PASS;
    
    struct iphdr *ip = (void *)(eth + 1);
    if ((void *)(ip + 1) > data_end) return XDP_PASS;
    
    __u32 *blocked = bpf_map_lookup_elem(&block_bloom_filter, &ip->saddr);
    if (blocked && *blocked == 1) {
        return XDP_DROP; // Wire speed hardware zero-copy drop
    }
    return XDP_PASS;
}`,
      terminalTrace: [
        { type: "cmd", text: "$ sudo bpftool prog load xdp_guard.o /sys/fs/bpf/xdp_guard type xdp" },
        { type: "info", text: "Verifying eBPF bytecode with Linux kernel in-kernel BPF verifier..." },
        { type: "stdout", text: "Verified 284 BPF instructions in 0.04ms. 0 stack spills." },
        { type: "cmd", text: "$ sudo bpftool net attach xdp id 42 dev eth0" },
        { type: "stdout", text: "Attached XDP program to eth0 (Driver Native Mode)" },
        { type: "success", text: "Benchmarked ingress: 14,210,000 packets/sec processed | CPU load: 1.4%" },
      ],
      chaosScenarios: [
        {
          id: "chaos-ebpf-syn-flood",
          title: "Simulate 14,000,000 PPS SYN Flood Attack",
          description: "Injects wire-speed spoofed TCP SYN flood to test XDP zero-copy drop efficiency and host CPU resistance.",
          command: "$ sudo pktgen -i eth0 -s 64 -p 80 -r 14000000",
          expectedResult: "14.2 Mpps dropped at NIC driver ring buffer with <2% host CPU impact.",
          recoveryTimeMs: 8,
          terminalLogs: [
            { type: "cmd", text: "$ sudo pktgen -i eth0 -s 64 -p 80 -r 14000000" },
            { type: "warn", text: "[ATTACK SIMULATION] 14,000,000 packets/sec ingress detected on eth0" },
            { type: "stdout", text: "XDP Bloom Filter Matched: 13,998,240 packets dropped before sk_buff allocation" },
            { type: "stdout", text: "Legitimate HTTP Traffic Latency: 0.12ms (Zero disruption)" },
            { type: "success", text: "✔ Wire-speed mitigation sustained. Linux kernel network stack protected." },
          ],
        },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:ebpf-packet-filter:1754842500",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-08-10T16:15:30Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "ebpf-packet-filter",
        skillName: "eBPF Kernel Network Packet Filter & Flow Tracer",
        domain: "systems",
        level: "master",
        score: 99.5,
        merkleRoot: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
        evidenceFingerprint: "0x4f8a12903847291048bce9123849104a8b7c6d5e",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-08-10T16:15:30Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "92427ae41e4649b934ca495991b7852b8559f8a3c2e1184bc23e3b0c44298fc1c1",
      },
    },
  },

  // FRONTEND ARCHITECTURE
  {
    id: "concurrent-vdom",
    label: "Concurrent React Virtual DOM Reconciler",
    shortCode: "FE-01",
    domain: "frontend",
    level: "expert",
    status: "verified",
    description: "Fiber-based time-sliced virtual DOM reconciliation engine with priority lanes and interruptible work units.",
    xp: 900,
    masteryCount: 4,
    freshnessPercentage: 100,
    iconName: "Layout",
    x: 180,
    y: 280,
    prerequisites: [],
    lastAttestedAt: "2026-07-15T18:00:00Z",
    evidence: {
      type: "github_commit",
      title: "Implement cooperative work loop with message channel yielding",
      repoUrl: "https://github.com/toibawani/micro-fiber-reconciler",
      commitHash: "8c91048a12903bce82910411e104f29a084bc912",
      branch: "main",
      timestamp: "2026-07-15T18:00:00Z",
      metrics: {
        throughput: "60 FPS locked",
        latency: "0.8ms",
        testPassRate: "100% (52/52)",
        coverage: "97.5%",
      },
      diffContent: `export function performConcurrentWorkOnRoot(root: FiberRoot): void {
  const currentLane = getHighestPriorityLane(root.pendingLanes);
  while (workInProgress !== null && !shouldYieldToHost()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
  if (workInProgress !== null) {
    scheduleHostCallback(performConcurrentWorkOnRoot.bind(null, root));
  } else {
    commitRoot(root);
  }
}`,
      terminalTrace: [
        { type: "cmd", text: "$ pnpm vitest run --coverage" },
        { type: "stdout", text: "PASS tests/reconciler/concurrent_lane_scheduling.test.ts" },
        { type: "stdout", text: "PASS tests/reconciler/suspense_boundary_unwind.test.ts" },
        { type: "stdout", text: "PASS tests/reconciler/time_slicing_yield.test.ts" },
        { type: "info", text: "Coverage: 97.5% Statements | 94.2% Branches | 100% Functions" },
        { type: "success", text: "All 52 tests passed in 410ms." },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:concurrent-vdom:1752602400",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-07-15T18:00:20Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "concurrent-vdom",
        skillName: "Concurrent React Virtual DOM Reconciler",
        domain: "frontend",
        level: "expert",
        score: 97.5,
        merkleRoot: "fe8912039481293847b4c9a1029384812a0fbc92384712039481293847b4c9a1",
        evidenceFingerprint: "0x8c91048a12903bce82910411e104f29a084bc912",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-07-15T18:00:20Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "e1048fbcda9801293847120aef1290482a9fbc10293817f0a12903847291a0b3",
      },
    },
  },
  {
    id: "webgpu-compute",
    label: "WebGPU Shader Compute & Buffer Pipelines",
    shortCode: "FE-02",
    domain: "frontend",
    level: "expert",
    status: "verified",
    description: "Hardware-accelerated compute shaders in WGSL with workgroup shared memory reduction for in-browser high-throughput vector transformations.",
    xp: 1100,
    masteryCount: 4,
    freshnessPercentage: 100,
    iconName: "Zap",
    x: 360,
    y: 280,
    prerequisites: ["concurrent-vdom"],
    lastAttestedAt: "2026-07-22T20:10:00Z",
    evidence: {
      type: "benchmark_suite",
      title: "WGSL compute shader for matrix tile multiplication",
      repoUrl: "https://github.com/toibawani/webgpu-matrix-kernels",
      commitHash: "3bce82910411e104f29a084bc9123891048a1290",
      branch: "main",
      timestamp: "2026-07-22T20:10:00Z",
      metrics: {
        throughput: "142 GFLOPS",
        latency: "1.6ms",
        memoryUsage: "18 MB",
        testPassRate: "100% (24/24)",
      },
      diffContent: `@group(0) @binding(0) var<storage, read> matrixA : array<f32>;
@group(0) @binding(1) var<storage, read> matrixB : array<f32>;
@group(0) @binding(2) var<storage, read_write> matrixC : array<f32>;

var<workgroup> tileA: array<array<f32, 16>, 16>;
var<workgroup> tileB: array<array<f32, 16>, 16>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>,
        @builtin(local_invocation_id) local_id : vec3<u32>) {
    // Tile-based matrix multiply with workgroup sync
    workgroupBarrier();
}`,
      terminalTrace: [
        { type: "cmd", text: "$ npx vitest run gpu-bench.test.ts" },
        { type: "info", text: "Initializing Headless WebGPU Compute Context (Vulkan backend)..." },
        { type: "stdout", text: "Testing 2048x2048 FP32 Matrix Multiplication..." },
        { type: "stdout", text: "CPU Baseline: 342.1ms" },
        { type: "stdout", text: "WebGPU Shader: 2.41ms (142x speedup)" },
        { type: "success", text: "All numerical float tolerances verified within 1e-6 precision." },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:webgpu-compute:1753215000",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-07-22T20:10:14Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "webgpu-compute",
        skillName: "WebGPU Shader Compute & Buffer Pipelines",
        domain: "frontend",
        level: "expert",
        score: 98.1,
        merkleRoot: "847120aef1290482a9fbc10293817f0a12903847291a0b392e1048fbcda98012",
        evidenceFingerprint: "0x3bce82910411e104f29a084bc9123891048a1290",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-07-22T20:10:14Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "0aef1290482a9fbc10293817f0a12903847291a0b392e1048fbcda9801284712",
      },
    },
  },
  {
    id: "dag-graph-engine",
    label: "Interactive High-FPS Force-Directed DAG Engine",
    shortCode: "FE-03",
    domain: "frontend",
    level: "master",
    status: "verified",
    description: "Bespoke Barnes-Hut spatial quadtree node layout engine rendering 10,000+ nodes at 120 FPS with inertia panning and dynamic edge collision avoidance.",
    xp: 1350,
    masteryCount: 5,
    freshnessPercentage: 100,
    iconName: "Share2",
    x: 540,
    y: 280,
    prerequisites: ["webgpu-compute"],
    lastAttestedAt: "2026-08-04T12:00:00Z",
    evidence: {
      type: "live_demo",
      title: "Quadtree-accelerated force DAG engine",
      repoUrl: "https://github.com/toibawani/merit-dag-engine",
      commitHash: "12903bce82910411e104f29a084bc9123891048a",
      branch: "main",
      timestamp: "2026-08-04T12:00:00Z",
      metrics: {
        throughput: "120 FPS",
        latency: "6.4ms",
        testPassRate: "100%",
        coverage: "98.9%",
      },
      diffContent: `export class SpatialQuadTree<T extends NodeBounds> {
  private root: QuadNode<T>;
  
  public computeBarnesHutForces(node: T, theta: number = 0.8): Vector2D {
    let forceX = 0, forceY = 0;
    const stack = [this.root];
    while (stack.length > 0) {
      const quad = stack.pop()!;
      const dx = quad.centerOfMass.x - node.x;
      const dy = quad.centerOfMass.y - node.y;
      const dist = Math.hypot(dx, dy) + 0.001;
      
      if (quad.width / dist < theta || quad.isLeaf) {
        const f = (GRAVITATIONAL_CONSTANT * quad.totalMass) / (dist * dist);
        forceX += (dx / dist) * f;
        forceY += (dy / dist) * f;
      } else {
        stack.push(...quad.children);
      }
    }
    return { x: forceX, y: forceY };
  }
}`,
      terminalTrace: [
        { type: "cmd", text: "$ npm run bench:layout" },
        { type: "stdout", text: "Benchmarking Barnes-Hut vs Naive N^2 on 5,000 node graph:" },
        { type: "stdout", text: "Naive O(N^2): 380ms per tick (2.6 FPS)" },
        { type: "stdout", text: "Barnes-Hut QuadTree O(N log N): 6.4ms per tick (156 FPS)" },
        { type: "success", text: "Inertia kinematics converged in 84 iterations." },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:dag-graph-engine:1754308800",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-08-04T12:00:40Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "dag-graph-engine",
        skillName: "Interactive High-FPS Force-Directed DAG Engine",
        domain: "frontend",
        level: "master",
        score: 99.4,
        merkleRoot: "01293847120aef1290482a9fbc10293817f0a12903847291a0b392e1048fbcda",
        evidenceFingerprint: "0x12903bce82910411e104f29a084bc9123891048a",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-08-04T12:00:40Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "bcda9801293847120aef1290482a9fbc10293817f0a12903847291a0b392e104",
      },
    },
  },

  // CLOUD & DISTRIBUTED SYSTEMS
  {
    id: "event-sourcing-ledger",
    label: "Distributed Event Sourcing Ledger & CQRS",
    shortCode: "OPS-01",
    domain: "cloud",
    level: "expert",
    status: "verified",
    description: "Append-only immutable event store with optimistic lock concurrency, deterministic aggregate rehydration, and sub-millisecond projection streaming.",
    xp: 950,
    masteryCount: 3,
    freshnessPercentage: 100,
    iconName: "Database",
    x: 180,
    y: 440,
    prerequisites: [],
    lastAttestedAt: "2026-07-20T10:30:00Z",
    evidence: {
      type: "github_commit",
      title: "Implement snapshot read-through cache with monotonic sequence verification",
      repoUrl: "https://github.com/toibawani/merit-event-ledger",
      commitHash: "5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f29",
      branch: "main",
      timestamp: "2026-07-20T10:30:00Z",
      metrics: {
        throughput: "85,000 ops/sec",
        p99Latency: "1.1ms",
        testPassRate: "100% (44/44)",
        coverage: "98.0%",
      },
      diffContent: `pub async fn append_to_stream(
    &self,
    stream_id: &StreamId,
    expected_version: u64,
    events: Vec<NewEvent>,
) -> Result<AppendResult, LedgerError> {
    let mut conn = self.pool.acquire().await?;
    let mut tx = conn.begin().await?;
    
    let current_version = sqlx::query_scalar!("SELECT MAX(version) FROM events WHERE stream_id = $1", stream_id)
        .fetch_optional(&mut *tx).await?.unwrap_or(0);
        
    if current_version != expected_version {
        return Err(LedgerError::OptimisticConcurrencyConflict { expected: expected_version, actual: current_version });
    }
    // Batch commit with monotonic sequence increment
    self.write_batch(&mut tx, stream_id, expected_version, events).await?;
    tx.commit().await?;
    Ok(AppendResult { new_version: expected_version + events.len() as u64 })
}`,
      terminalTrace: [
        { type: "cmd", text: "$ cargo test --test ledger_concurrency -- --nocapture" },
        { type: "stdout", text: "Spawning 100 concurrent workers against single aggregate stream..." },
        { type: "stdout", text: "Verified 100,000 events committed with 0 sequence collisions." },
        { type: "stdout", text: "P50 Latency: 0.4ms | P99 Latency: 1.1ms | Max: 2.8ms" },
        { type: "success", text: "Concurrency validation passed: 44/44 tests." },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:event-sourcing-ledger:1753007400",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-07-20T10:30:45Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "event-sourcing-ledger",
        skillName: "Distributed Event Sourcing Ledger & CQRS",
        domain: "cloud",
        level: "expert",
        score: 98.0,
        merkleRoot: "c4d3e2f1a0b93c84f295e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f295e4f3",
        evidenceFingerprint: "0x5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f29",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-07-20T10:30:45Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "3c84f295e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c4d3e2f1a0b93c84f295e4f3",
      },
    },
  },
  {
    id: "k8s-operator-controller",
    label: "Kubernetes Dynamic Auto-Healing CRD Operator",
    shortCode: "OPS-02",
    domain: "cloud",
    level: "master",
    status: "verified",
    description: "Custom Go controller using controller-runtime with rate-limited exponential backoff, leader lease election, and multi-cluster state reconciliation.",
    xp: 1250,
    masteryCount: 4,
    freshnessPercentage: 100,
    iconName: "Cloud",
    x: 360,
    y: 440,
    prerequisites: ["event-sourcing-ledger"],
    lastAttestedAt: "2026-07-31T15:45:00Z",
    evidence: {
      type: "pull_request",
      title: "operator: implement zero-downtime rolling statefulset partition updates",
      repoUrl: "https://github.com/toibawani/merit-k8s-operator",
      commitHash: "0d9e8f7a6b5c4d3e2f1a0b93c84f295e4f3a2b1c",
      branch: "feat/rolling-partitions",
      timestamp: "2026-07-31T15:45:00Z",
      metrics: {
        p99Latency: "120ms",
        testPassRate: "100% (38/38)",
        coverage: "95.2%",
      },
      diffContent: `func (r *ClusterReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    var cluster meritv1.MeritCluster
    if err := r.Get(ctx, req.NamespacedName, &cluster); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }
    if cluster.Spec.Paused {
        return ctrl.Result{}, nil
    }
    if err := r.reconcileStatefulSetCanary(ctx, &cluster); err != nil {
        r.Recorder.Event(&cluster, "Warning", "ReconcileFailed", err.Error())
        return ctrl.Result{RequeueAfter: time.Second * 5}, err
    }
    return ctrl.Result{RequeueAfter: time.Minute * 10}, nil
}`,
      terminalTrace: [
        { type: "cmd", text: "$ make test ENVTEST_K8S_VERSION=1.30.0" },
        { type: "stdout", text: "Starting envtest control plane..." },
        { type: "stdout", text: "Ran 38 of 38 Specs in 4.128 seconds" },
        { type: "stdout", text: "SUCCESS! -- 38 Passed | 0 Failed | 0 Pending" },
        { type: "success", text: "All custom CRDs and admission webhooks validated." },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:k8s-operator-controller:1753976700",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-07-31T15:45:30Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "k8s-operator-controller",
        skillName: "Kubernetes Dynamic Auto-Healing CRD Operator",
        domain: "cloud",
        level: "master",
        score: 96.8,
        merkleRoot: "2f1a0b93c84f295e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f295e4f3a2b1c",
        evidenceFingerprint: "0x0d9e8f7a6b5c4d3e2f1a0b93c84f295e4f3a2b1c",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-07-31T15:45:30Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "b1c0d9e8f7a6b5c4d3e2f1a0b93c84f295e4f3a22f1a0b93c84f295e4f3a2b1c",
      },
    },
  },
  {
    id: "wireguard-mesh",
    label: "Zero-Trust WireGuard P2P Mesh Tunneling",
    shortCode: "OPS-03",
    domain: "cloud",
    level: "expert",
    status: "verified",
    description: "NAT-traversing peer-to-peer overlay network with Noise Protocol handshake, dynamic ephemeral key rotation, and MTU auto-probing.",
    xp: 1150,
    masteryCount: 4,
    freshnessPercentage: 100,
    iconName: "Lock",
    x: 540,
    y: 440,
    prerequisites: ["k8s-operator-controller"],
    lastAttestedAt: "2026-08-08T19:20:00Z",
    evidence: {
      type: "live_demo",
      title: "STUN-backed P2P UDP hole punching coordinator",
      repoUrl: "https://github.com/toibawani/wiremesh-core",
      commitHash: "7a6b5c4d3e2f1a0b93c84f295e4f3a2b1c0d9e8f",
      branch: "main",
      timestamp: "2026-08-08T19:20:00Z",
      metrics: {
        throughput: "9.2 Gbps",
        latency: "1.4ms",
        testPassRate: "100%",
      },
      diffContent: `pub async fn establish_direct_p2p_channel(
    &self,
    peer_pubkey: &NoisePublicKey,
    stun_endpoints: &[SocketAddr],
) -> Result<TunnelInterface, MeshError> {
    let socket = UdpSocket::bind("0.0.0.0:0").await?;
    let discovered_addr = self.stun_probe(&socket, stun_endpoints).await?;
    for attempt in 0..5 {
        socket.send_to(PUNCH_HEADER, discovered_addr).await?;
        tokio::time::sleep(Duration::from_millis(15)).await;
    }
    self.initialize_noise_session(socket, peer_pubkey).await
}`,
      terminalTrace: [
        { type: "cmd", text: "$ cargo run --bin mesh-handshake-test --release" },
        { type: "info", text: "Testing P2P NAT punch between AWS eu-west-1 and GCP us-central1..." },
        { type: "stdout", text: "STUN discovered WAN socket: 54.210.82.11:41820" },
        { type: "stdout", text: "Direct UDP hole punch succeeded in 24ms." },
        { type: "stdout", text: "Noise_IK handshake complete. WireGuard symmetric cipher engaged." },
        { type: "success", text: "Iperf3 benchmark: 9.21 Gbps throughput | Zero packet loss over 60s." },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:wireguard-mesh:1754680800",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-08-08T19:20:18Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "wireguard-mesh",
        skillName: "Zero-Trust WireGuard P2P Mesh Tunneling",
        domain: "cloud",
        level: "expert",
        score: 97.9,
        merkleRoot: "5c4d3e2f1a0b93c84f295e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f295e4f",
        evidenceFingerprint: "0x7a6b5c4d3e2f1a0b93c84f295e4f3a2b1c0d9e8f",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-08-08T19:20:18Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "a2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f295e4f35c4d3e2f1a0b93c84f295e4",
      },
    },
  },

  // AI & APPLIED ML
  {
    id: "quantized-llm-runtime",
    label: "4-Bit (AWQ/GPTQ) Quantized LLM Inference Runtime",
    shortCode: "AI-01",
    domain: "ai",
    level: "master",
    status: "verified",
    description: "Ultra-fast int4 matrix-vector multiplication kernel in C++/WASM with SIMD packed unpacking for real-time edge LLM generation.",
    xp: 1500,
    masteryCount: 7,
    freshnessPercentage: 100,
    iconName: "Sparkles",
    x: 360,
    y: 600,
    prerequisites: ["rust-wasm-allocator"],
    lastAttestedAt: "2026-08-12T14:10:00Z",
    evidence: {
      type: "benchmark_suite",
      title: "SIMD 4-bit dequantization kernel for Mistral-7B",
      repoUrl: "https://github.com/toibawani/edge-llm-quant",
      commitHash: "2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f295e4f3a",
      branch: "main",
      timestamp: "2026-08-12T14:10:00Z",
      metrics: {
        throughput: "42.5 tokens/sec",
        latency: "23ms TTFT",
        memoryUsage: "3.8 GB",
        testPassRate: "100%",
      },
      diffContent: `void dequantize_row_q4_0(const block_q4_0 * restrict x, float * restrict y, int k) {
    const int nb = k / QK4_0;
    for (int i = 0; i < nb; i++) {
        const float d = x[i].d;
        const uint8_t * restrict pp = x[i].qs;
        #pragma unroll(8)
        for (int l = 0; l < QK4_0/2; ++l) {
            const uint8_t vi = pp[l];
            const int8_t vi0 = (vi & 0x0F) - 8;
            const int8_t vi1 = (vi >> 4)   - 8;
            y[i*QK4_0 + l]             = vi0 * d;
            y[i*QK4_0 + l + QK4_0/2]   = vi1 * d;
        }
    }
}`,
      terminalTrace: [
        { type: "cmd", text: "$ python3 bench_quant.py --model mistral-7b-instruct-q4_0.gguf" },
        { type: "info", text: "Loading 4-bit quantized weights into unified memory..." },
        { type: "stdout", text: "Model Size: 3.82 GB | Context Window: 8,192 tokens" },
        { type: "stdout", text: "Prompt Processing: 480 tokens/sec" },
        { type: "stdout", text: "Token Generation: 42.5 tokens/sec (P99: 24.1ms/token)" },
        { type: "success", text: "Perplexity delta vs FP16 baseline: +0.038 (within acceptable threshold)." },
      ],
      chaosScenarios: [
        {
          id: "chaos-llm-oom-pressure",
          title: "Simulate 8,192 Token Context under 95% RAM Pressure",
          description: "Saturates OS unified memory cache to test paging and fallback dequantization stability.",
          command: "$ python3 test/stress_memory_oom.py --model mistral-7b --tokens 8192",
          expectedResult: "Zero memory page faults, continuous 42.1 tokens/sec inference sustained.",
          recoveryTimeMs: 22,
          terminalLogs: [
            { type: "cmd", text: "$ python3 test/stress_memory_oom.py --model mistral-7b --tokens 8192" },
            { type: "info", text: "Simulating 95% host memory allocation pressure..." },
            { type: "stdout", text: "KV-cache eviction policy engaged: Sliding window retention active" },
            { type: "stdout", text: "Generating 8,192 token prompt attention mask (23.4ms TTFT)" },
            { type: "success", text: "✔ 42.5 tokens/sec sustained with zero OOM kernel SIGKILL events." },
          ],
        },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:quantized-llm-runtime:1755007800",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-08-12T14:10:45Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "quantized-llm-runtime",
        skillName: "4-Bit (AWQ/GPTQ) Quantized LLM Inference Runtime",
        domain: "ai",
        level: "master",
        score: 99.1,
        merkleRoot: "e8f7a6b5c4d3e2f1a0b93c84f295e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b93c84",
        evidenceFingerprint: "0x2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f295e4f3a",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-08-12T14:10:45Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "f3a2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f295e4e8f7a6b5c4d3e2f1a0b93c84",
      },
    },
  },
  {
    id: "hnsw-vector-indexer",
    label: "HNSW Multi-Layer Vector Graph Indexer",
    shortCode: "AI-02",
    domain: "ai",
    level: "expert",
    status: "verified",
    description: "Hierarchical Navigable Small World graph for million-scale high-dimensional embedding similarity search with heuristic entrypoint pruning.",
    xp: 1100,
    masteryCount: 5,
    freshnessPercentage: 100,
    iconName: "GitMerge",
    x: 540,
    y: 600,
    prerequisites: ["quantized-llm-runtime"],
    lastAttestedAt: "2026-08-14T08:30:00Z",
    evidence: {
      type: "benchmark_suite",
      title: "Rust SIMD cosine distance HNSW index",
      repoUrl: "https://github.com/toibawani/hnsw-vector-rs",
      commitHash: "1a0b93c84f295e4f3a2b1c0d9e8f7a6b5c4d3e2f",
      branch: "main",
      timestamp: "2026-08-14T08:30:00Z",
      metrics: {
        throughput: "12,500 QPS",
        latency: "0.65ms",
        p99Latency: "1.2ms",
        testPassRate: "100% (30/30)",
      },
      diffContent: `pub fn search_layer(
    &self,
    query: &[f32],
    entry_points: &[NodeId],
    ef: usize,
    level: usize,
) -> Vec<Candidate> {
    let mut visited = VisitedSet::new(self.max_nodes);
    let mut candidates = MinHeap::with_capacity(ef);
    let mut w = MaxHeap::with_capacity(ef);
    for &ep in entry_points {
        let dist = self.simd_cosine_dist(query, self.get_vector(ep));
        visited.insert(ep);
        candidates.push(Candidate { id: ep, dist });
        w.push(Candidate { id: ep, dist });
    }
    self.traverse_neighbors_at_level(&mut candidates, &mut w, &mut visited, query, ef, level);
    w.into_sorted_vec()
}`,
      terminalTrace: [
        { type: "cmd", text: "$ cargo test --release --test hnsw_recall -- --nocapture" },
        { type: "stdout", text: "Indexing 1,000,000 vectors (1536 dimensions) with M=32, ef_construction=128..." },
        { type: "stdout", text: "Build time: 42.1s (23,750 vectors/sec)" },
        { type: "stdout", text: "Testing 10,000 queries at ef_search=64:" },
        { type: "stdout", text: "Recall@10: 99.42% | Average Query Latency: 0.65ms" },
        { type: "success", text: "Benchmark passed: 12,500 Queries Per Second sustained." },
      ],
    },
    proofReceipt: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "urn:meritos:receipt:toibawani:hnsw-vector-indexer:1755157800",
      type: ["VerifiableCredential", "MeritOSCompetenceAttestation"],
      issuer: {
        id: "did:merit:ed25519:9f8a3c2e1184bc23",
        name: "MeritOS Automated Attestation Authority",
        publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
        keyType: "Ed25519VerificationKey2020",
      },
      issuanceDate: "2026-08-14T08:30:20Z",
      credentialSubject: {
        id: "did:merit:dev:toibawani",
        username: "toibawani",
        skillId: "hnsw-vector-indexer",
        skillName: "HNSW Multi-Layer Vector Graph Indexer",
        domain: "ai",
        level: "expert",
        score: 98.7,
        merkleRoot: "b5c4d3e2f1a0b93c84f295e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f295e4",
        evidenceFingerprint: "0x1a0b93c84f295e4f3a2b1c0d9e8f7a6b5c4d3e2f",
      },
      proof: {
        type: "JsonWebSignature2020",
        created: "2026-08-14T08:30:20Z",
        verificationMethod: "did:merit:ed25519:9f8a3c2e1184bc23#key-1",
        proofPurpose: "assertionMethod",
        signatureValue: "e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b93c84f295b5c4d3e2f1a0b93c84f295e4",
      },
    },
  },
];

export const TOIBA_PROFILE: UserProfile = {
  username: "toibawani",
  displayName: "Toiba Wani",
  bio: "Systems Architect & Compilers Researcher. Building high-throughput distributed primitives, zero-copy WASM allocators, and deterministic verifiable software.",
  title: "Principal Systems & Distributed Infrastructure Engineer",
  level: 42,
  rankTitle: "Grandmaster Systems Architect",
  xp: 12850,
  nextLevelXp: 15000,
  streakDays: 48,
  freshnessPercentage: 100,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  githubUrl: "https://github.com/toibawani",
  did: "did:merit:ed25519:9f8a3c2e1184bc23",
  publicKey: "0482a9fbc10293817f0a12903847291a0b392e1048fbcda9801293847120aef129",
  verificationScore: 98.6,
  totalVerifiedSkills: 11,
  globalRank: "Top 0.1%",
  domainBreakdown: {
    systems: 99.1,
    frontend: 98.3,
    cloud: 97.6,
    ai: 98.9,
  },
  radarScores: {
    quality: 98,
    architecture: 99,
    reliability: 97,
    speed: 99,
    cryptographicDepth: 100,
  },
  activityLedger: [
    {
      id: "act-01",
      timestamp: "2026-08-14T08:30:20Z",
      type: "attestation_signed",
      skillId: "hnsw-vector-indexer",
      skillName: "HNSW Multi-Layer Vector Graph Indexer",
      domain: "ai",
      status: "verified",
      receiptHash: "0xb5c4d3e2f1a0...95e4",
      blockHeight: 894120,
    },
    {
      id: "act-02",
      timestamp: "2026-08-12T14:10:45Z",
      type: "node_unlocked",
      skillId: "quantized-llm-runtime",
      skillName: "4-Bit (AWQ/GPTQ) Quantized LLM Inference Runtime",
      domain: "ai",
      status: "verified",
      receiptHash: "0xe8f7a6b5c4d3...3c84",
      blockHeight: 893540,
    },
    {
      id: "act-03",
      timestamp: "2026-08-10T16:15:30Z",
      type: "verification_audited",
      skillId: "ebpf-packet-filter",
      skillName: "eBPF Kernel Network Packet Filter & Flow Tracer",
      domain: "systems",
      status: "verified",
      receiptHash: "0xa1b2c3d4e5f6...ef0",
      blockHeight: 892810,
    },
  ],
  skills: TOIBA_SKILLS,
};

export const ALEX_PROFILE: UserProfile = {
  username: "alex_rivera",
  displayName: "Alex Rivera",
  bio: "Kernel Hacker & Zero-Trust Infrastructure Engineer. Specialized in eBPF flow filters, Linux memory internals, and WireGuard mesh routing.",
  title: "Staff Kernel & Distributed Security Engineer",
  level: 38,
  rankTitle: "Kernel Specialist",
  xp: 9400,
  nextLevelXp: 12000,
  streakDays: 32,
  freshnessPercentage: 96,
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  githubUrl: "https://github.com/alexrivera-kernel",
  did: "did:merit:ed25519:7a8b9c0d1e2f3a4b",
  publicKey: "047a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456",
  verificationScore: 97.4,
  totalVerifiedSkills: 8,
  globalRank: "Top 0.5%",
  domainBreakdown: {
    systems: 99.4,
    frontend: 88.2,
    cloud: 98.1,
    ai: 91.0,
  },
  radarScores: {
    quality: 96,
    architecture: 98,
    reliability: 99,
    speed: 98,
    cryptographicDepth: 97,
  },
  activityLedger: [
    {
      id: "act-alex-01",
      timestamp: "2026-08-11T12:00:00Z",
      type: "attestation_signed",
      skillId: "ebpf-packet-filter",
      skillName: "eBPF Kernel Network Packet Filter",
      domain: "systems",
      status: "verified",
      receiptHash: "0x7a8b9c0d...1e2f",
      blockHeight: 893100,
    },
  ],
  skills: TOIBA_SKILLS.filter(s => s.domain === "systems" || s.domain === "cloud"),
};

export const ELENA_PROFILE: UserProfile = {
  username: "elena_rostova",
  displayName: "Elena Rostova",
  bio: "Applied ML Researcher & Tensor Compiler Engineer. Quantizing large generative models for real-time edge execution.",
  title: "Lead AI Inference & Tensor Architect",
  level: 40,
  rankTitle: "Tensor Inference Master",
  xp: 11200,
  nextLevelXp: 14000,
  streakDays: 41,
  freshnessPercentage: 99,
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
  githubUrl: "https://github.com/elena-ai-core",
  did: "did:merit:ed25519:3c4d5e6f7a8b9c0d",
  publicKey: "043c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef",
  verificationScore: 98.2,
  totalVerifiedSkills: 9,
  globalRank: "Top 0.2%",
  domainBreakdown: {
    systems: 94.0,
    frontend: 92.5,
    cloud: 95.0,
    ai: 99.8,
  },
  radarScores: {
    quality: 98,
    architecture: 97,
    reliability: 96,
    speed: 99,
    cryptographicDepth: 98,
  },
  activityLedger: [
    {
      id: "act-elena-01",
      timestamp: "2026-08-13T10:00:00Z",
      type: "attestation_signed",
      skillId: "quantized-llm-runtime",
      skillName: "4-Bit (AWQ/GPTQ) Quantized LLM Inference Runtime",
      domain: "ai",
      status: "verified",
      receiptHash: "0x3c4d5e6f...7a8b",
      blockHeight: 893900,
    },
  ],
  skills: TOIBA_SKILLS.filter(s => s.domain === "ai" || s.domain === "systems"),
};

export const MOCK_USER_PROFILE = TOIBA_PROFILE;
export const INITIAL_SKILLS = TOIBA_SKILLS;
