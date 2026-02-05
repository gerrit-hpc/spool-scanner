export class NFCService {
  private ndef: NDEFReader | null = null;

  public static isSupported(): boolean {
    return typeof window !== "undefined" && "NDEFReader" in window;
  }

  /**
   * Starts scanning for NFC tags.
   * @param onReading Callback when a tag is read.
   * @param onError Callback when an error occurs during reading.
   * @param signal AbortSignal to stop scanning.
   */
  public async scan(
    onReading: (message: NDEFMessage, serialNumber: string) => void,
    onError?: (error: Event) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    if (!NFCService.isSupported()) {
      throw new Error("Web NFC is not supported in this browser.");
    }

    this.ndef = new window.NDEFReader();

    this.ndef.onreading = (event: NDEFReadingEvent) => {
      onReading(event.message, event.serialNumber);
    };

    this.ndef.onreadingerror = (event: Event) => {
      if (onError) {
        onError(event);
      }
    };

    await this.ndef.scan({ signal });
  }

  /**
   * Writes data to an NFC tag.
   * @param data The string or object to write. Objects are written as application/json.
   * @param options Write options.
   */
  public async write(
    data: string | Record<string, unknown>,
    options?: NDEFWriteOptions,
  ): Promise<void> {
    if (!NFCService.isSupported()) {
      throw new Error("Web NFC is not supported in this browser.");
    }

    const ndef = new window.NDEFReader();
    let message: NDEFMessageSource;

    if (typeof data === "string") {
      message = data;
    } else {
      const encoder = new TextEncoder();
      message = {
        records: [
          {
            recordType: "mime",
            mediaType: "application/json",
            data: encoder.encode(JSON.stringify(data)),
          },
        ],
      };
    }

    await ndef.write(message, options);
  }
}

export function decodeTextRecord(record: NDEFRecord): string {
  const decoder = new TextDecoder(record.encoding || "utf-8");
  return decoder.decode(record.data);
}

export function decodeJSONRecord<T = unknown>(record: NDEFRecord): T | null {
  const decoder = new TextDecoder();
  try {
    return JSON.parse(decoder.decode(record.data)) as T;
  } catch (error) {
    console.error("Error parsing JSON record:", error);
    return null;
  }
}
