import { Switch } from "@/components/ui/switch";
import { Controller } from "react-hook-form";

export function ToggleItem({ control, name, label }: { control: any; name: string; label: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-brand-secondary-9">{label}</span>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-brand-primary-6" 
                    />
                )}
            />
        </div>
    )
}