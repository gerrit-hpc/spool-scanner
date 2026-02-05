export {};

declare global {
  interface Window {
    NDEFReader: {
      new (): NDEFReader;
    };
  }

  interface NDEFReader extends EventTarget {
    scan(options?: NDEFScanOptions): Promise<void>;
    write(message: NDEFMessageSource, options?: NDEFWriteOptions): Promise<void>;
    onreading: ((this: NDEFReader, event: NDEFReadingEvent) => any) | null;
    onreadingerror: ((this: NDEFReader, event: Event) => any) | null;
  }

  interface NDEFScanOptions {
    signal?: AbortSignal;
  }

  interface NDEFWriteOptions {
    ignoreRead?: boolean;
    overwrite?: boolean;
    signal?: AbortSignal;
  }

  type NDEFMessageSource = string | ArrayBuffer | ArrayBufferView | NDEFRecordInit[];

  interface NDEFRecordInit {
    recordType: string;
    mediaType?: string;
    id?: string;
    encoding?: string;
    lang?: string;
    data?: NDEFRecordData;
  }

  type NDEFRecordData = string | ArrayBuffer | ArrayBufferView | NDEFRecordInit[];

  interface NDEFReadingEvent extends Event {
    serialNumber: string;
    message: NDEFMessage;
  }

  interface NDEFMessage {
    records: NDEFRecord[];
  }

  interface NDEFRecord {
    recordType: string;
    mediaType?: string;
    id?: string;
    encoding?: string;
    lang?: string;
    data?: DataView;
    toRecords?: () => NDEFRecord[];
  }
}
