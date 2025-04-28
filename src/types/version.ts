/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-25 19:03:25
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-25 19:03:25
 * @FilePath: \mmcl\src\types\version.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

export interface Version {
  id: string;
  releaseTime: string;
  time: string;
  type: string;
  url: string;
}

export interface VersionList {
  versions: Version[];
}

export interface VersionLatest {
  release: string;
  snapshot: string;
}

export interface VersionListResponse {
  latest: VersionLatest;
  versions: Version[];
}



