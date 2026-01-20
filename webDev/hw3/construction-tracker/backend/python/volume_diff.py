#!/usr/bin/env python3
import argparse
import json
import os
import sys
from typing import Tuple


def _load_point_cloud(path: str):
    if not path or not isinstance(path, str):
        raise RuntimeError(f"Invalid file path value: {path!r}")

    if not os.path.exists(path):
        raise RuntimeError(f"File not found: {path}")

    if os.path.isdir(path):
        raise RuntimeError(f"Expected a file path but got a directory: {path}")

    ext = os.path.splitext(path)[1].lower()

    # Normal, extension-based handling (fast path)
    if ext == ".ply":
        import open3d as o3d
        pcd = o3d.io.read_point_cloud(path)
        return pcd

    if ext in (".las", ".laz"):
        import numpy as np
        import laspy
        import open3d as o3d
        las = laspy.read(path)
        pts = np.vstack((las.x, las.y, las.z)).T.astype("float64")
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(pts)
        return pcd

    if ext == ".e57":
        import numpy as np
        import open3d as o3d
        try:
            import pye57
        except Exception as e:
            raise RuntimeError(
                "Missing dependency 'pye57' for .e57 files. Install: pip install pye57"
            ) from e

        e57 = pye57.E57(path)
        if e57.scan_count == 0:
            raise RuntimeError("E57 file contains no scans")
        data = e57.read_scan(0, intensity=False, colors=False)
        pts = np.vstack(
            (data["cartesianX"], data["cartesianY"], data["cartesianZ"])
        ).T.astype("float64")
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(pts)
        return pcd

    # Fallback: extension missing or unexpected -> try to detect by attempting readers.
    # This directly addresses your current failure (ext == "") when backend stores files without suffix.
    # Order: LAS -> E57 -> Open3D generic
    # If all fail, raise a clear error.
    try:
        import numpy as np
        import laspy
        import open3d as o3d

        try:
            las = laspy.read(path)  # works even if extension is missing
            pts = np.vstack((las.x, las.y, las.z)).T.astype("float64")
            pcd = o3d.geometry.PointCloud()
            pcd.points = o3d.utility.Vector3dVector(pts)
            return pcd
        except Exception:
            pass

        try:
            import pye57  # optional
            e57 = pye57.E57(path)
            if e57.scan_count > 0:
                data = e57.read_scan(0, intensity=False, colors=False)
                pts = np.vstack(
                    (data["cartesianX"], data["cartesianY"], data["cartesianZ"])
                ).T.astype("float64")
                pcd = o3d.geometry.PointCloud()
                pcd.points = o3d.utility.Vector3dVector(pts)
                return pcd
        except Exception:
            pass

        try:
            pcd = o3d.io.read_point_cloud(path)
            # If Open3D returns an empty pcd, treat as failure
            if len(pcd.points) > 0:
                return pcd
        except Exception:
            pass

    except Exception:
        # If imports fail (rare), fall through to the final error
        pass

    raise RuntimeError(
        f"Unsupported extension '{ext}'. Supported: .ply, .las/.laz, .e57. "
        f"Path received by job: {path!r}. "
        f"If ext is empty, your backend likely saved the upload without the original suffix."
    )


def _estimate_volume_voxels(pcd, voxel_size: float, max_points: int) -> Tuple[float, int]:
    import numpy as np
    import open3d as o3d

    pts = np.asarray(pcd.points)
    if pts.size == 0:
        return 0.0, 0

    if max_points > 0 and len(pts) > max_points:
        idx = np.random.choice(len(pts), size=max_points, replace=False)
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(pts[idx])

    vg = o3d.geometry.VoxelGrid.create_from_point_cloud(pcd, voxel_size=voxel_size)
    voxels = vg.get_voxels()
    count = len(voxels)
    volume = count * (voxel_size ** 3)
    return float(volume), int(count)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--t1", required=True)
    ap.add_argument("--t2", required=True)
    ap.add_argument("--voxel", type=float, default=0.05)  # 5cm default
    ap.add_argument("--max_points", type=int, default=2_000_000)
    args = ap.parse_args()

    try:
        pcd1 = _load_point_cloud(args.t1)
        pcd2 = _load_point_cloud(args.t2)
        v1, c1 = _estimate_volume_voxels(pcd1, args.voxel, args.max_points)
        v2, c2 = _estimate_volume_voxels(pcd2, args.voxel, args.max_points)
        out = {
            "volumeT1M3": v1,
            "volumeT2M3": v2,
            "volumeChangeM3": v2 - v1,
            "voxelSizeM": args.voxel,
            "voxelCountT1": c1,
            "voxelCountT2": c2,
        }
        print(json.dumps(out))
        return 0
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
