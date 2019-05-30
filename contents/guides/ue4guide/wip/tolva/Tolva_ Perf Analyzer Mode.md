---
sortIndex: 2
---

## Game Thread:

**General:**

1. Display RenderBudget:

- Budget BebylonPerf

2. Freeze Game Thread 
   - Pause

2. Check Game Thread Perf

- stat Game

4. Pause Rendering
   - Show Rendering

**Animation:**

1. Skeletal Meshes

   Show SkeletalMeshes

   r.EnableMorphTargets

   r.SkinCache.Mode

   a.URO.Enable

   a.URO.ForceAnimRate

   a.URO.ForceInterpolation

**Physics:**

1. Toggle All Collision

   Might need to implement these.

1. Toggle Generate All Overlap Events

   Might need to implement this either in python or you might be able to the editor commands to set on all actors/objects: set <classname> <propertyName> <value>

1. Toggle Anim Dynamics

   p.AnimDynamics

   p.AnimDynamicsWind

   p.AnimDynamicsRestrictLOD

   p.RagdollPhysics

1. Visualize by:

   TraceTag or TraceTagAll

## Profiling GPU:

'pause' - pauses game thread and then use 'show' command to profile rendering

FreezeFrame 0.5 - Freezes/Pauses game after a delay. Custom function in UCheatManager

1. Test if GPU Bottleneck:

   - r.screenpercentage=20 => fast test to see if GPU is bottleneck

   - show Rendering **(verify this this actually disables rendering)**

1. Test if Texture Bandwidth is problem:

- Replace all textures with 2x2 textures

3. Test if Texture MipMaps are appropriate
   - Visualize mipmap scale
   - Visualize UV scale

3. Test quad overdraw/small triangle size

3. - Show QuadOverdraw

3. Test Overdraw is problem
   - Show Translucency
   - Show SeparateTranslucency

3. Test Meshes bottleneck

   - Show StaticMeshes

   - Show InstancedStaticMeshes

   - Show SkeletalMeshes

   - r.ForceLOD

   - Compute Animation

   - - r.SkinCache.Mode
     - r.MorphTarget.Mode

3. Test if Lighting is bottleneck

    a. Toggle All Lighting

   - Show Lighting **(verify this this actually disables rendering)**

   - ToggleLight **(verify this this actually disables rendering)**

   - show DeferredLighting **(verify this this actually disables rendering)**

   - Show VisualizeLightCulling

     b. Toggle Static Lighting

   - ​	r.AllowStaticLighting

   - show DirectLighting **(verify this this actually disables rendering)**

     c. Toggle Dynamic Lighting

   - ​	Show DirectionalLights

   - Show PointLights

   - Show SpotLights

   - Show SkyLighting

     d. Toggle Lighting Components

   - i. Direct Lighting

     - show DirectLighting

     - r.SimpleDynamicLighting

       ii. Ambient Occlusion

     - Show AmbientOcclusion

     - Show Diffuse

     - Show Specular

     iii. Global Illumination

     - Show GlobalIllumination
     - Show SubsurfaceScattering

     iv. Indirect Lighting Cache

     - r.IndirectLightingCache
     - show IndirectLightingCache **(verify)**

     v. Reflection Environment

     - Show ReflectionEnvironment

3. Test if Shader Complexity Bound:
   - ToggleForceDefaultMaterial
   - Show Materials

3. Test FX System

   a. Toggle Particles

   **(find all commands to turn them off completely)**

   b. Toggle Particle Simulation

   - r.GPUParticle.Simulate

   - r.GPUParticle.FixDeltaSeconds

   - FX.FreezeGPUSimulation

   - FX.FreezeParticleSimulation

   - FX.RestartAll

   c. Toggle Particle Rendering

   ​	Show Particles

   d. Turn Off CPU Particles

   e. Turn Off GPU Particles

3. - FX.AllowGPUParticles

   f. Toggle Decals

3. Test If Post Processing

   - Show PostProcessing

   - Show PostProcessMaterial (this is for toggling custom postprocessing materials which are usually very expensive)

   - Show AntiAliasing

   - Show Decals


11. Disable rendering features in order of priority by r.LimitRenderingFeatures=FeatureLevel. Feature Levels:

    1. AntiAliasing

    1. EyeAdaptation

    1. SeparateTranslucency

    1. DepthOfField

    1. AmbientOcclusion

    1. CameraImperfections

    1. Decals

    1. LensFlares

    1. Bloom

    1. ColorGrading

    1. Tonemapper

    1. Refraction

    1. ReflectionEnvironment

    1. AmbientCubemap

    1. MotionBlur

    1. DirectLighting

    1. Lighting

    1. Translucency

    1. TextRender

    1. Particles

    1. SkeletalMeshes

    1. StaticMeshes

    1. BSP

    1. Paper2DSprites

## Profiling Draw Thread Performance:

1. Look at Draw Call Counter and make sure it's within budget

   - Stat RHI
   - Stat SceneRendering
   - Look at triangle counts. You can do show \[object category] to turn off big groups of objects to see where triangle counts are coming from
     - Show shadows
     - Show dynamicshadows

1. Freeze Rendering
   - r.RenderTimeFrozen
   - FreezeRendering
   - FREEZEALL
   - PAUSERENDERCLOCK
   - FX.FreezeGPUSimulation
   - FX.FreezeParticleSimulation

1. Inspect Draw Lists:

- r.DumpDrawListStats

4. Occlusion/Visibility Culling:

   a. Use:

   - stat initviews -
      Displays
      information on how long visibility culling took and how effective it was.
      Visible section count is the single most important stat with respect to
      rendering thread performance, and that is dominated by Visible Static Mesh
     Elements under STAT INITVIEWS, but Visible Dynamic Primitives also factors in.

b. FIX:

- show Bounds
- DumpVisibleActors
- r.VisualizeOccludedPrimitives
- showflag.visualizeculling
- Show bounds

5. Check if driver overhead is cause
   - stat d3d11rhi

5. GPU/CPU Stalls or Pipeline Bubbles
   - Do RenderDoc/NSight capture, grab timings, and see if the perf goes up. If it does, the problem is a sync point
     - stat scenerendering to look at Stats
     - Launch GPUView to drill into specifics

## VR Specific:

- Launch Oculus Performance HUD Tool

  - Should be accessible with console command from U4

  - Disable ASW

  - Look at these timings compared to emulate stereo mode. These are accurate GPU timings

  - Targets:

    - Should have &lt;= 1 dropped frame per 5 seconds

    - Should have GPU render time ~10ms

### Root Cause Analysis:

**Overview:**

Common stat options: [-ms=5.0][-root=empty] [leaf=empty][-depth=maxint] [-nodisplay]

stat groupname[+] - toggles displaying stats group, + enables hierarchical display

stat namedmarker #markername# - adds a custom marker to the stats stream

stat hier -group=groupname [-sortby=name][-maxhistoryframes=60] [-reset][-maxdepth=4]

stat group list|listall|enable name|disable name|none|all|default - manages enabling/disabling recording of the stats groups. Doing stat [groupname] automatically enables that group

stat none - visually turn off all stats (recording is still active)

1. Find perf offending causers:

   stat slow [-ms=1.0][-depth=4] - toggles displaying the game and render thread stats

   stat dumpevents [-ms=0.2][-all] - dumps events history for slow events, -all adds other threads besides game and render

2) After narrowing down, dump specific stat group frame

stat dumpframe [-ms=5.0][-root=empty] [leaf=empty][-depth=maxint] - dumps a frame of stats

 stat dumpframe -ms=.001 -root=initviews

 stat dumpframe -ms=.001 -root=shadow

Get more consistent stats:

stat dumpave|dumpmax|dumpsum [-start | -stop | -num=30][-ms=5.0] [-root=empty][leaf=empty] [-depth=maxint] - aggregate stats over multiple frames

3. Hitches

stat dumphitches [-start | -stop | no explicit option toggles ] - toggles dumping hitches

t.HitchThreshold to set threshold

4. Record to disk

stat startfile - starts dumping a capture

stat stopfile - stops dumping a capture (regular, raw, memory) Low

stat startfileraw - starts dumping a raw capture

### General:

1. Game Thread:

   - stat Game

   - tick.LogTicks

   - dumpticks

   - tick.ShowPrerequistes

1. Threading Stalls
   - stat Threading
   - stat CPUStalls

1. Engine UObject System/Constructing UObjects/PostInit/Allocation/etc:

   - stat Object

   - stat ObjectVerbose

   - stat GC

1. Game Thread Scene Update:
   - stat Component
   - stat UObjects
   - Stat SceneUpdate (only the GT timers)
   - stat Character
   - stat Tickables (things like movieplayer, timermanager, etc)
   - Tick.LogTicks = 1 or dumpticks

1. Triangle Count/Frame/Render/Game/GPU timings:

   - stat Engine

   - stat RHI

   - stat SceneRendering
     - RenderViewFamily = Render Thread
     - InitViews = Culling, dependent on how many objects (not just visible) in the scene

1. Inspect CPU:
   - stat dumpcpu
   - stat ServerCPU
   - stat CPUStalls

1. Perf By Tick Functions/Tasks/"Job System":

   - stat TaskGraphTasks

   - stat Tickables

   - stat TickGroups

1. Animation:
   - stat Anim
   - stat MorphTarget
   - stat MovieSceneEval
   - stat GPUSkinCache
   - ANIMSEQSTATS

1. Physics:

   - stat Physics

   - stat PhysXTasks

   - stat Collision

   - stat CollisionVerbose

   - Stat CollisionTags

   - stat Character

   - Stat ImmediatePhysics

1. FX
   - stat Particles
   - stat ParticleMem
   - stat GPUParticles
   - stat Emitters
   - stat BeamParticles
   - stat MeshParticles
   - stat TrailParticles
   - DUMPPARTICLECOUNTS
   - DUMPPARTICLEMEM
   - PARTICLEMESHUSAGE

1. Misc

   - stat Quick

   - r.DisplayInternals

#### Render Thread:

1. DrawThread/Scene Update Stalls:

   - stat SceneRendering

   - Stat SceneUpdate

1. D3D Driver overhead:
   - stat d3d11rhi

1. Render Thread Command Marshalling from Game Thread

   - stat RenderThreadCommands

   - stat RHICmdList

   - stat CommandListMarkers

   - stat ParallelCommandListMarkers

   - stat LightRendering

1. Dump Material/Shader inf
   - DumpMaterialStats: Dump material information
   - DumpShaderStats: Dump shader information
   - DumpShaderPipelineStats: Dump shader pipeline information

1. Visibility Culling & Primitive Component count:

   - stat initviews -

   - Displays information on how long visibility culling took and how effective it was. Visible section count is the single most important stat with respect to rendering thread performance, and that is dominated by Visible Static Mesh Elements under STAT INITVIEWS, but Visible Dynamic Primitives also factors in.

   - show camerafrustums

   - show bounds

### GPU

1. GPU

   - stat GPU

   - stat RHI (GPU Memory Pressure)

1. Texture Bandwidth
   - ShowMipLevels
   - VisRT
   - r.VisualizeTexturePool
   - ListTextures
   - ListStreamingTextures

1. GI

   - r.Cache.DrawInterpolationPoints

   - r.Cache.DrawDirectionalShadowing

   - r.Cache.DrawLightingSamples

1. Post-Processing 
   - r.ListSceneColorMaterials

1. VR

   stat OculusHMD

   stat Oculus

1. Misc

   r.GPUBusyWait

   SynthBenchmark

### Advanced:

- **Hitches:**

  stat dumphitches

  CauseHitches


- **Memory:**

  Button to explain how to Launch MTuner

  Button to explain how to Launch igmemtrace

  memreport [-full]

  stat dumpnonframe [groupname]

  stat toggledebug

  stat TextureGroup

  stat TexturePool

  stat LLMPlatform

  stat LLM

  stat LLMMalloc

  stat LLMRHI

  stat LLMAssets

  stat Memory

  stat MemoryPlatform

  stat MemoryAllocator

  Stat MemoryStaticMesh

  Stat SceneMemory

  memreport -fullprof


- **Misc:**

  stat dumpnonframe [groupname]

  stat Levels

  stat LoadTime

  stat LoadTimeVerbose

  stat AsyncLoad

  stat AsyncLoadGameThread

  stat Streaming / stat streaming sortby=name

  stat StreamingDetails

  PauseTextureStreaming

  DumpLightmapSizeOnDisk

  r.DumpRenderTargetPoolMemory

  rhi.DumpMemory

  r.RenderTargetPool.Events

  r.RenderTargetPoolMin'

**Below here needs to be reimplemented & tasked in Hansoft to Andrew**

### Performance Tuning:

 **Tunable Optimizations:**

1. Ticking
   - DbgCmd('tick.AllowAsyncComponentTicks'),
   - DbgCmd('tick.AllowConcurrentTickQueue'),
   - DbgCmd('tick.AllowAsyncTickDispatch'),
   - DbgCmd('tick.AllowAsyncTickCleanup'),

1. Toggle Occlusion Queries
   - r.AllowOcclusionQueries
   - r.DownsampledOcclusionQueries
   - r.NumBufferedOcclusionQueries
   - r.OcclusionQueryLocation (Does nothing in forward)

1. Toggle HZB:
   - r.HZBOcclusion=0
   - **EXPERIMENTAL!!** r.DoInitViewsLightingAfterPrepass

1. Toggle EarlyZPass settings:
   - r.EarlyZPass=1
   - r.EarlyZPassMovable=True
   - r.EarlyZPassOnlyMaterialMasking
   - r.MinScreenRadiusForDepthPrepass=0.3
   - r.CustomDepth.Order

1. Animation Update and Evaluation

   DbgCmd('a.ParallelAnimEvaluation'),

   DbgCmd('a.ParallelAnimUpdate'),

   DbgCmd('a.ForceParallelAnimUpdate'),

1. Compute Skinning
   - r.SkinCache.Mode=1
   - r.SkinCache.CompileShaders=1
   - r.MorphTarget.Mode=1
   - r.SkinCache.MaxGPUElementsPerFrame (can't find this)
   - r.SkinCache.BufferSize (can't find this)
   - r.SkinCache.NumTangentIntermediateBuffers
   - r.SkinCache.SceneMemoryLimitInMB

1. FX
   - FX.AllowGPUSorting
   - FX.AllowCulling
   - FX.AllowAsyncTick
   - FX.EarlyScheduleAsync
   - FX.GPUCollisionDepthBounds
   - FX.MaxParticleTilePreAllocation
   - FX.ParticleCollisionIgnoreInvisibleTime
   - FX.ParticleSlackGPU

1. Render Target settings
   - r.ClearSceneMethod=1
   - r.SceneColorFormat=3
   - r.GBufferFormat=1

1. Lighting & GI

   DbgCmd('r.Cache.LightingCacheMovableObjectAllocationSize'),

   DbgCmd('r.Cache.LightingCacheDimension'),

   DbgCmd('r.Cache.UpdatePrimsTaskEnabled'),

   DbgCmd('r.MinScreenRadiusForLights'),

   DbgCmd('r.MinScreenRadiusForDepthPrepass'),

1. Misc
   - DbgCmd('r.Forward.LightGridPixelSize'),
   - DbgCmd('r.Forward.LightGridSizeZ'),
   - DbgCmd('r.Forward.MaxCulledLightsPerCell'),
   - DbgCmd('r.Forward.LightLinkedListCulling'),
   - DbgCmd('r.DeferUniformBufferUpdatesUntilVisible'),
   - DbgCmd('r.UseParallelGetDynamicMeshElementsTasks'),
   - DbgCmd('r.Tonemapper.Quality'),

### **Quality Trade-Offs:**

- Toggle TranslucentLightingVolume settings:

  r.TranslucentLightingVolume

  r.TranslucentVolumeMinFOV

  r.TranslucentVolumeFOVSnapFactor

  r.TranslucencyVolumeBlur

  r.TranslucencyLightingVolumeDim

  r.TranslucencyLightingVolumeInnerDistance

  r.TranslucencyLightingVolumeOuterDistance

  (Inner & Outer distance are the ones to change for getting around the popping)


- Toggle Custom Depth:

  r.CustomDepth=0


- Toggle Separate Translucency:

  r.SeparateTranslucency=False

  r.SeparateTranslucencyAutoDownsample=1

  r.SeparateTranslucencyScreenPercentage=100

  r.SeparateTranslucencyDurationDownsampleThreshold=1

  r.SeparateTranslucencyDurationUpsampleThreshold=0.25


- RenderTargets & PostProcessing

  r.DBuffer

  r.Atmosphere

  r.CapsuleShadows

  r.ContactShadows

  DbgCmd('r.HighQualityLightMaps'),


- AA:

  r.DefaultFeature.AntiAliasing=3

  r.MSAA.CompositingSampleCount=4

  r.MSAACount=4 (0=> TXAA, 1=>No MSAA, 2,4,8=> MSAA Count)

  DbgCmd('r.WideCustomResolve'),

  DbgCmd('r.DoTiledReflections'),


- DBuffer: r.DBuffer=False


- GI

  r.Cache.UpdateEveryFrame

  r.Cache.SampleTransitionSpeed


- Misc Graphics Quality:

  r.FastBlurThreshold=0

  r.BloomQuality=1

  r.MaxAnisotropy=8

  DbgCmd('r.LightFunctionQuality'),


- Skinning:

  r.GPUSkin.Limit2BoneInfluences

  r.SkinCache.RecomputeTangents


- FX:

  FX.GPUCollisionDepthBounds=250

  FX.MaxCPUParticlesPerEmitter=1000

  FX.MaxGPUParticlesSpawnedPerFrame=524288

  FX.GPUSpawnWarningThreshold=10000

  DbgCmd('r.GPUParticle.FixDeltaSeconds'),

  DbgCmd('r.GPUParticle.FixTolerance'),

  DbgCmd('r.GPUParticle.MaxNumIterations'),

  DbgCmd('r.ParticleLightQuality'),


- Reflection Captures

  r.ReflectionEnvironment

  r.ReflectionCaptureResolution=128

  r.ReflectionEnvironmentBeginMixingRoughness=0.1

  r.ReflectionEnvironmentEndMixingRoughness=0.3

  r.ReflectionEnvironmentLightmapMixBasedOnRoughness

  r.ReflectionEnvironmentLightmapMixing

  r.ReflectionEnvironmentLightmapMixLargestWeight=10000

Big Kludges:

- r.pd=1