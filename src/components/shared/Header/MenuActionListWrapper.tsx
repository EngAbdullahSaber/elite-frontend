import { TableRow } from "@/types/components/Table";
import MenuActionList, { MenuActionItem } from "./MenuActionList";


interface props<T = Record<string, any>> {
    actionsMenuItems?: (row: T, onClose?: () => void) => MenuActionItem[];
    onClose?: () => void;
    row: TableRow<T>;

}
export default function MenuActionListWrapper<T = Record<string, any>>({ actionsMenuItems, row, onClose }: props<T>) {

    return <MenuActionList items={actionsMenuItems?.(row, onClose)} onClose={onClose} />
}