import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Checkbox from "../../components/ui/Checkbox";
import Radio from "../../components/ui/Radio";
import Switch from "../../components/ui/Switch";
import Card, { CardHeader, CardContent, CardFooter } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Modal from "../../components/ui/Modal";
import Drawer from "../../components/ui/Drawer";
import Toast from "../../components/ui/Toast";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import Skeleton from "../../components/ui/Skeleton";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import Container from "../../components/layout/Container";
import Section from "../../components/layout/Section";
import Breadcrumb from "../../components/layout/Breadcrumb";
import { FiHeart, FiBookmark, FiClock, FiSearch } from "react-icons/fi";

export default function DesignSystem() {
    // Component Interactive States
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    const [inputVal, setInputVal] = useState("");
    const [textareaVal, setTextareaVal] = useState("");
    const [selectVal, setSelectVal] = useState("");
    
    const [chkVal, setChkVal] = useState(false);
    const [rdVal, setRdVal] = useState("opt1");
    const [swVal, setSwVal] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastType, setToastType] = useState("success");
    const [toastMsg, setToastMsg] = useState("");
    
    const [btnLoading, setBtnLoading] = useState(false);

    const triggerToast = (type, msg) => {
        setToastType(type);
        setToastMsg(msg);
        setIsToastOpen(true);
    };

    const triggerLoading = () => {
        setBtnLoading(true);
        setTimeout(() => setBtnLoading(false), 2000);
    };

    const mockOptions = [
        { label: "Option One", value: "opt1" },
        { label: "Option Two", value: "opt2" },
        { label: "Option Three", value: "opt3" }
    ];

    return (
        <Container className="py-10 text-left">
            <Breadcrumb />
            
            <header className="mb-10 pb-6 border-b border-border">
                <h1 className="text-4xl font-extrabold text-text-h mb-2 font-heading">RecipeHub Design System</h1>
                <p className="text-text/70 text-lg">Reusable UI components and styles tailored for the GourmetLab platform.</p>
            </header>

            {/* Colors Swatches */}
            <Section id="colors" className="mb-12">
                <h2 className="text-2xl font-bold text-text-h mb-6 font-heading">1. Color Palette</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {/* Primary */}
                    <div className="flex flex-col gap-2">
                        <div className="h-16 w-full rounded-medium bg-primary shadow-xs"></div>
                        <span className="text-sm font-bold text-text-h">Primary</span>
                        <span className="text-xs text-text/60">#FF6B35</span>
                    </div>
                    {/* Secondary */}
                    <div className="flex flex-col gap-2">
                        <div className="h-16 w-full rounded-medium bg-secondary shadow-xs"></div>
                        <span className="text-sm font-bold text-text-h">Secondary (Green)</span>
                        <span className="text-xs text-text/60">#22C55E</span>
                    </div>
                    {/* Accent */}
                    <div className="flex flex-col gap-2">
                        <div className="h-16 w-full rounded-medium bg-accent shadow-xs" style={{ backgroundColor: "#FBBF24" }}></div>
                        <span className="text-sm font-bold text-text-h">Accent (Yellow)</span>
                        <span className="text-xs text-text/60">#FBBF24</span>
                    </div>
                    {/* Gray Neutrals */}
                    <div className="flex flex-col gap-2">
                        <div className="h-16 w-full rounded-medium bg-code-bg shadow-xs"></div>
                        <span className="text-sm font-bold text-text-h">Neutral Gray</span>
                        <span className="text-xs text-text/60">#6B7280</span>
                    </div>
                    {/* Status Danger */}
                    <div className="flex flex-col gap-2">
                        <div className="h-16 w-full rounded-medium bg-danger shadow-xs"></div>
                        <span className="text-sm font-bold text-text-h">Danger</span>
                        <span className="text-xs text-text/60">#EF4444</span>
                    </div>
                </div>
            </Section>

            {/* Typography */}
            <Section id="typography" className="mb-12">
                <h2 className="text-2xl font-bold text-text-h mb-6 font-heading">2. Typography</h2>
                <div className="flex flex-col gap-4 border border-border rounded-medium p-6 bg-code-bg/10">
                    <div>
                        <span className="text-xs text-text/50 font-bold block mb-1">H1 - Heading (Poppins Bold 48px)</span>
                        <h1 className="text-[48px] leading-tight font-bold text-text-h font-heading m-0">GourmetLab Heading</h1>
                    </div>
                    <div className="border-t border-border pt-4">
                        <span className="text-xs text-text/50 font-bold block mb-1">H2 - Subheading (Poppins SemiBold 36px)</span>
                        <h2 className="text-[36px] font-semibold text-text-h font-heading m-0">Recipe Showcase</h2>
                    </div>
                    <div className="border-t border-border pt-4">
                        <span className="text-xs text-text/50 font-bold block mb-1">H3 - (Poppins SemiBold 30px)</span>
                        <h3 className="text-[30px] font-semibold text-text-h font-heading m-0">Platform Features</h3>
                    </div>
                    <div className="border-t border-border pt-4">
                        <span className="text-xs text-text/50 font-bold block mb-1">Body Text (Inter Regular 16px)</span>
                        <p className="text-base text-text m-0">
                            Discover, create, and share recipes with cooking enthusiasts globally. Build your custom cookbooks and profile panels.
                        </p>
                    </div>
                    <div className="border-t border-border pt-4">
                        <span className="text-xs text-text/50 font-bold block mb-1">Small / Caption (Inter 14px / 12px)</span>
                        <p className="text-sm text-text/70 m-0">Small note: Recipes require authentication to edit.</p>
                    </div>
                </div>
            </Section>

            {/* Buttons Showcase */}
            <Section id="buttons" className="mb-12">
                <h2 className="text-2xl font-bold text-text-h mb-6 font-heading">3. Button Variants</h2>
                <div className="flex flex-wrap gap-4 items-center mb-6">
                    <Button variant="primary" onClick={() => triggerToast("success", "Primary Clicked!")}>Primary Button</Button>
                    <Button variant="secondary" onClick={() => triggerToast("info", "Secondary Clicked!")}>Secondary Button</Button>
                    <Button variant="outline" onClick={() => triggerToast("warning", "Outline Clicked!")}>Outline Button</Button>
                    <Button variant="success" onClick={() => triggerToast("success", "Success Action!")}>Success</Button>
                    <Button variant="danger" onClick={() => triggerToast("error", "Danger Triggered!")}>Danger</Button>
                    <Button variant="ghost" onClick={() => triggerToast("info", "Ghost Clicked!")}>Ghost</Button>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="md">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                    <Button variant="primary" loading={btnLoading} onClick={triggerLoading}>
                        {btnLoading ? "Processing" : "Simulate Loading"}
                    </Button>
                    <Button variant="primary" disabled>Disabled Button</Button>
                </div>
            </Section>

            {/* Form Fields */}
            <Section id="forms" className="mb-12">
                <h2 className="text-2xl font-bold text-text-h mb-6 font-heading">4. Forms & Inputs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Input 
                        label="Email Address"
                        placeholder="chef@recipehub.com"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        helperText="We will never share your email."
                    />
                    <Input 
                        label="Password Validation"
                        type="password"
                        placeholder="••••••••"
                        error="Password must contain at least 8 characters"
                    />
                    <Select 
                        label="Select Culinary Category"
                        options={mockOptions}
                        value={selectVal}
                        onChange={(e) => setSelectVal(e.target.value)}
                        placeholder="Choose a category"
                    />
                    <SearchBar 
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onClear={() => setSearchValue("")}
                    />
                </div>
                <div className="mb-6">
                    <Textarea 
                        label="Recipe Description"
                        placeholder="Tell the readers what makes this dish so delicious..."
                        value={textareaVal}
                        onChange={(e) => setTextareaVal(e.target.value)}
                        maxLength={250}
                    />
                </div>
                <div className="flex flex-wrap gap-8 items-center border border-border rounded-medium p-5 bg-bg">
                    <Checkbox 
                        label="Receive newsletters"
                        checked={chkVal}
                        onChange={(e) => setChkVal(e.target.checked)}
                    />
                    <div className="flex gap-4">
                        <Radio 
                            label="Vegetarian"
                            name="diet"
                            value="opt1"
                            checked={rdVal === "opt1"}
                            onChange={(e) => setRdVal(e.target.value)}
                        />
                        <Radio 
                            label="Non-Vegetarian"
                            name="diet"
                            value="opt2"
                            checked={rdVal === "opt2"}
                            onChange={(e) => setRdVal(e.target.value)}
                        />
                    </div>
                    <Switch 
                        label="Enable Dark Mode Preferences"
                        checked={swVal}
                        onChange={(e) => setSwVal(e.target.checked)}
                    />
                </div>
            </Section>

            {/* Badges & Avatars */}
            <Section id="badges-avatars" className="mb-12">
                <h2 className="text-2xl font-bold text-text-h mb-6 font-heading">5. Badges & Avatars</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4 border border-border rounded-medium p-5 bg-bg">
                        <h4 className="font-heading font-bold mb-2">Avatars</h4>
                        <div className="flex gap-4 items-center">
                            <Avatar name="Chef Julia" size="sm" />
                            <Avatar name="Chef Julia" size="md" />
                            <Avatar name="Chef Julia" size="lg" />
                            <Avatar name="Alex Chef" size="xl" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 border border-border rounded-medium p-5 bg-bg">
                        <h4 className="font-heading font-bold mb-2">Badges</h4>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="primary">Easy</Badge>
                            <Badge variant="secondary">Intermediate</Badge>
                            <Badge variant="success">Vegetarian</Badge>
                            <Badge variant="warning">Rating 4.9</Badge>
                            <Badge variant="danger">High Calorie</Badge>
                            <Badge variant="info">30 Mins</Badge>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Recipe Card Mockup */}
            <Section id="cards" className="mb-12">
                <h2 className="text-2xl font-bold text-text-h mb-6 font-heading">6. Composable Card</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <Card className="flex flex-col">
                        <div className="relative h-48 bg-code-bg flex items-center justify-center text-text/30 font-bold overflow-hidden">
                            {/* Card Image placeholder */}
                            <span className="text-4xl">🍝</span>
                            <div className="absolute top-3 right-3">
                                <Badge variant="primary">Italian</Badge>
                            </div>
                        </div>
                        <CardContent className="flex-1 flex flex-col gap-3">
                            <h3 className="font-heading font-bold text-lg m-0 text-text-h">Pasta Carbonara</h3>
                            <div className="flex gap-4 items-center text-xs text-text/60 font-semibold">
                                <span className="flex items-center gap-1"><FiClock /> 30 Minutes</span>
                                <span className="text-secondary">★★★★★ (4.8)</span>
                            </div>
                            <p className="text-sm text-text/80 line-clamp-2">
                                A classic Roman pasta recipe made with eggs, hard cheese, cured pork, and black pepper. Simple yet flavorful.
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-code-bg/10">
                            <div className="flex items-center gap-2">
                                <Avatar name="Chef Marco" size="sm" />
                                <span className="text-xs font-bold text-text-h">Chef Marco</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 border border-border rounded-full hover:bg-red-50 hover:text-danger hover:border-red-200 cursor-pointer transition-colors" aria-label="Add to favorites">
                                    <FiHeart size={14} />
                                </button>
                                <button className="p-2 border border-border rounded-full hover:bg-blue-50 hover:text-info hover:border-blue-200 cursor-pointer transition-colors" aria-label="Bookmark">
                                    <FiBookmark size={14} />
                                </button>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Loading/Skeleton Card */}
                    <Card hover={false} className="flex flex-col">
                        <Skeleton variant="rect" height="192px" />
                        <CardContent className="flex flex-col gap-3">
                            <Skeleton variant="text" width="60%" height="20px" />
                            <Skeleton variant="text" width="40%" />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" width="80%" />
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-code-bg/10">
                            <div className="flex items-center gap-2">
                                <Skeleton variant="avatar" width="32px" height="32px" />
                                <Skeleton variant="text" width="60px" />
                            </div>
                            <Skeleton variant="avatar" width="32px" height="32px" />
                        </CardFooter>
                    </Card>
                </div>
            </Section>

            {/* Overlays, Dialogs & Modals */}
            <Section id="overlays" className="mb-12">
                <h2 className="text-2xl font-bold text-text-h mb-6 font-heading">7. Interactive Overlays & Modals</h2>
                
                <div className="flex flex-wrap gap-4 mb-6">
                    <Button variant="outline" onClick={() => setIsModalOpen(true)}>Open Modal Dialog</Button>
                    <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>Open Slide Drawer</Button>
                </div>

                <div className="flex flex-col gap-4 border border-border rounded-medium p-5 bg-bg">
                    <h4 className="font-heading font-bold mb-2">Toast Triggers</h4>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="secondary" size="sm" onClick={() => triggerToast("success", "Success notification triggered!")}>Trigger Success Toast</Button>
                        <Button variant="secondary" size="sm" onClick={() => triggerToast("error", "Error warning alert triggered!")}>Trigger Error Toast</Button>
                        <Button variant="secondary" size="sm" onClick={() => triggerToast("warning", "Caution alert parameters warning.")}>Trigger Warning Toast</Button>
                        <Button variant="secondary" size="sm" onClick={() => triggerToast("info", "Information toast notification.")}>Trigger Info Toast</Button>
                    </div>
                </div>

                {/* Inline Alerts */}
                <div className="flex flex-col gap-4 mt-6">
                    <Alert title="Tips for chefs" variant="info">
                        Always prepare your mis-en-place before starting to heat the pan. It saves time and prevents burns.
                    </Alert>
                    <Alert title="Action Required" variant="warning">
                        Your recipe catalog is empty. Create your first recipe page.
                    </Alert>
                    <Alert title="Recipe Saved!" variant="success">
                        The Chocolate Lava Cake recipe was successfully stored in your profile catalog.
                    </Alert>
                </div>
            </Section>

            {/* Pagination Component */}
            <Section id="pagination" className="mb-12">
                <h2 className="text-2xl font-bold text-text-h mb-6 font-heading">8. Pagination Control</h2>
                <div className="border border-border rounded-medium p-6 bg-bg text-center">
                    <p className="text-sm text-text/80 mb-2">Active Page: <span className="font-bold text-primary">{currentPage}</span></p>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={5}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            triggerToast("info", `Moved to Page ${page}`);
                        }}
                    />
                </div>
            </Section>

            {/* Modal instance */}
            <Modal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Simulation Modal Dialog"
                footer={
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" onClick={() => { setIsModalOpen(false); triggerToast("success", "Modal Confirmed!"); }}>Accept</Button>
                    </>
                }
            >
                <p>This is a modal dialog styled dynamically using standard container widths. The background page body scroll is locked when this overlay is visible.</p>
            </Modal>

            {/* Drawer instance */}
            <Drawer 
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Drawer Panel"
            >
                <p className="mb-4">This drawer slides in from the right of the screen. You can put dashboard settings, filters, or notifications lists inside it.</p>
                <Button variant="danger" size="sm" className="w-full" onClick={() => setIsDrawerOpen(false)}>Close Panel</Button>
            </Drawer>

            {/* Toast instance */}
            <Toast 
                isOpen={isToastOpen}
                message={toastMsg}
                type={toastType}
                onClose={() => setIsToastOpen(false)}
            />
        </Container>
    );
}
