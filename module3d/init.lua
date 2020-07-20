--[[
TheNexusAvenger
Adorns a 3D model to a frame.
GitHub: https://github.com/TheNexusAvenger/Module3D



Module3D.new(Model)
	Creates a Model3D object.
Module3D:Attach3D(Frame,Model)
	Attaches a model or part to a frame. Returns a Model3D object.
	Does not use a clone of the model so it can be referenced directly.



Model3D object (extends ViewportFrame):
	Model3D.Object3D - the model for the bounding box. If the input model was a model, it will be the same as the input.
	Model3D.AdornFrame - the frame the model is adorned to.
	Model3D.Camera - the camera used by the viewport frame.
		[Derecated; use Model3D.CurrentCamera]
	
	Model3D:Update()
		Force updates the camera CFrame.
	Model3D:SetActive(Active)
		[Deprecated, use Model3D.Visible]
		Sets the frame being active.
	Model3D:GetActive()
		[Deprecated, use Model3D.Visible]
		Reutrns if the frame is active.
	Model3D:SetCFrame(NewCF)
		Sets the CFrame offset.
		Automatically updates the camera CFrame.
	Model3D:GetCFrame()
		Returns the CFrame offset.
	Model3D:SetDepthMultiplier(Multiplier)
		Sets the multiplier for how far back the camera should go.
		Automatically updates the camera CFrame.
	Model3D:GetDepthMultiplier()
		Returns the depth multiplier
	Model3D:End()
		[Deprecated, use Model3D:Destroy()]
		Destroys the frame and unparents the model.
--]]

--Position to move the part/model to. Used to ensure the physics don't interact with the game.
local FAR_POSITION = Vector3.new(0,10000,0)



local Module3D = {}



--[[
Creates a Model3D object.
--]]
function Module3D.new(Model)
	local CFrameOffset = CFrame.new()
	local DepthMultiplier = 1
	
	local Model3D = {}
	Model3D.Object3D = Model
	
	--If the model is a BasePart, make it a model.
	if Model:IsA("BasePart") then
		local NewModel = Instance.new("Model")
		NewModel.Name = "Model3D"
		Model.Parent = NewModel
		NewModel.PrimaryPart = Model
		
		Model = NewModel
		Model3D.Object3D = Model
	end
	
	--Create the viewport frame.
	local ViewportFrame = Instance.new("ViewportFrame")
	ViewportFrame.BackgroundTransparency = 1
	Model3D.AdornFrame = ViewportFrame
	
	--Create the camera.
	local Camera = Instance.new("Camera")
	Camera.Parent = ViewportFrame
	ViewportFrame.CurrentCamera = Camera
	
	--Set up the model.
	local BasePrimaryPart = Model.PrimaryPart
	if not BasePrimaryPart then
		Model.PrimaryPart = Model:FindFirstChildWhichIsA("BasePart",true)
	end
	
	--If a primary part exists, move the model.
	if Model.PrimaryPart then
		Model:SetPrimaryPartCFrame(CFrame.new(FAR_POSITION - Model.PrimaryPart.Position) * Model.PrimaryPart.CFrame)
		Model.PrimaryPart = BasePrimaryPart
	end
	Model.Parent = ViewportFrame
	
	--[[
	Updates the camera's CFrame.
	--]]
	local function UpdateCFrame()
		local BoundingCFrame,BoundingSize = Model:GetBoundingBox()
		local ModelCenter = BoundingCFrame.p
		
		--Determine the distance back.
		local MaxSize = math.max(BoundingSize.X,BoundingSize.Y,BoundingSize.Z)
		local DistanceBack = ((MaxSize/math.tan(math.rad(Camera.FieldOfView)))) * DepthMultiplier
		local Center = CFrame.new(ModelCenter)
		Camera.CFrame = Center * CFrameOffset * CFrame.new(0,0,(MaxSize/2) + DistanceBack)
		Camera.Focus = Center
	end
	
	--[[
	Force updates the camera CFrame.
	--]]
	function Model3D:Update()
		UpdateCFrame()
	end
	
	--[[
	Sets the frame being active.
	--]]
	function Model3D:SetActive(Active)
		ViewportFrame.Visible = Active
	end
	
	--[[
	Reutrns if the frame is active.
	--]]
	function Model3D:GetActive()
		return ViewportFrame.Visible
	end
	
	--[[
	Sets the CFrame offset.
	--]]
	function Model3D:SetCFrame(NewCF)
		CFrameOffset = NewCF
		UpdateCFrame()
	end
	
	--[[
	Returns the CFrame offset.
	--]]
	function Model3D:GetCFrame()
		return CFrameOffset
	end
	
	--[[
	Sets the multiplier for how far back the camera should go.
	--]]
	function Model3D:SetDepthMultiplier(Multiplier)
		DepthMultiplier = Multiplier
		UpdateCFrame()
	end
	
	--[[
	Returns the depth multiplier
	--]]
	function Model3D:GetDepthMultiplier()
		return DepthMultiplier
	end
	
	--[[
	Destroys the frame and unparents the model.
	--]]
	function Model3D:Destroy()
		self.AdornFrame:Destroy()
		self.Object3D:Destroy()
	end
	
	--[[
	Destroys the frame and unparents the model.
	--]]
	function Model3D:End()
		self:Destroy()
	end
	
	--Create and set the object metatable.
	local Metatable = {}
	setmetatable(Model3D,Metatable)
	Metatable.__index = function(self,Index)
		--Return the camera (deprecated property).
		if Index == "Camera" then
			return ViewportFrame.CurrentCamera
		end
		
		--Return the object value.
		local ObjectValue = rawget(Model3D,Index)
		if ObjectValue ~= nil then
			return ObjectValue
		end
		
		--Return the frame's value.
		return ViewportFrame[Index]
	end
	Metatable.__newindex = function(self,Index,NewValue)
		ViewportFrame[Index] = NewValue
	end
	
	UpdateCFrame()
	return Model3D
end

--[[
Adorns a 3D model to a frame.
Returns a Model3D object.
--]]
function Module3D:Attach3D(Frame,Model)
	--Create the Model3D object.
	local Model3D = Module3D.new(Model)
	Model3D.AnchorPoint = Vector2.new(0.5,0.5)
	Model3D.Position = UDim2.new(0.5,0,0.5,0)
	Model3D.Visible = false
	Model3D.Parent = Frame
	
	--[[
	Updates the frame size.
	--]]
	local function UpdateFrameSize()
		local AbsoluteSize = Frame.AbsoluteSize
		local MinSize = math.abs(math.min(AbsoluteSize.X,AbsoluteSize.Y)) 
		Model3D.AdornFrame.Size = UDim2.new(0,MinSize,0,MinSize)
	end
	local FrameChanged = Frame.Changed:Connect(UpdateFrameSize)
	UpdateFrameSize()
	
	--Override the destroy method to disconnect the events.
	local BaseDestroy = Model3D.Destroy
	local function NewDesstroy(self)
		BaseDestroy(self)
		
		--Disconnect the resize event.
		if FrameChanged then
			FrameChanged:Disconnect()
			FrameChanged = nil
		end
	end
	rawset(Model3D,"Destroy",NewDesstroy)
	
	--Return the Model3D.
	return Model3D
end



return Module3D