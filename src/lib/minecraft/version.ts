/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-25 18:21:29
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-25 18:58:13
 * @FilePath: \mmcl\src\lib\minecraft\version.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { invoke } from "@tauri-apps/api/core";
import { VersionListResponse } from "@/types/version";

class Version {
  private versionJson: any;
  constructor () {
    this.versionJson = null;
  }
  
  /**
   * @description: 获取所有版本
   * @return {*}
   */
  public async minecraft_get_allVersion(): Promise<VersionListResponse> {
    const versionJson: string = await invoke('get_mc_version')
    this.versionJson = JSON.parse(versionJson);
    return this.versionJson;
  }
}


export default Version;