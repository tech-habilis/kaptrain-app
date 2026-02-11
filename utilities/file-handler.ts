import { SupabaseClient } from "@supabase/supabase-js";
import moment from "moment";
import Config from "../constants/config";
import { supabaseAdmin } from "./supabase/admin.supabase";

export class FileHandler {
    constructor(
        private readonly client: SupabaseClient = supabaseAdmin
    ) {}
    
    public async uploadFile({rawFile}: {rawFile: File}): Promise<string> {
        const _fileName = rawFile.name.includes(" ")
            ? rawFile.name.replace(" ", "_")
            : rawFile.name

        const fileName = `${moment()}_${_fileName}`

        const {data, error} = await this.client.storage.from(Config.SUPABASE_STORAGE_BUCKET_NAME).upload(fileName, rawFile, {contentType: rawFile.type})

        if (error) throw error

        return data.path
    }

    public readFile({filePath}: {filePath: string}): string {
        if (filePath.startsWith("http")) return filePath
        
        const {data} = this.client.storage.from(Config.SUPABASE_STORAGE_BUCKET_NAME).getPublicUrl(filePath)

        return data.publicUrl
    }

    public async  deleteFile({filePath}: {filePath: string}): Promise<void> {
        const {error} = await this.client.storage.from(Config.SUPABASE_STORAGE_BUCKET_NAME).remove([filePath])

        if (error) throw error
    }
}