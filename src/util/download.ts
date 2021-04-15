export default function download(filename: string, type: string, data: string) {
  let file = new Blob([data], { type });
  let url = URL.createObjectURL(file);
  let link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
}
